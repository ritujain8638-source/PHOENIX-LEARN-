import os
import sys
import json
import uuid
import mimetypes
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

from db import (
    init_db, get_connection, create_or_get_google_user, register_user,
    authenticate_user, get_all_profiles, get_user_by_id, update_user_profile
)
from adaptive_engine import AdaptiveEngine
from gemini_service import GeminiService

STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class PhoenixServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def _set_cors_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-goog-api-key")
        self.send_header("Content-Type", content_type)
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(200)

    def _parse_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                raw_data = self.rfile.read(content_length).decode("utf-8")
                return json.loads(raw_data)
        except Exception as e:
            print("Error parsing JSON body:", e)
        return {}

    def _send_json(self, data: Any, status=200):
        self._set_cors_headers(status, "application/json")
        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

    # ─── GET ROUTES ─────────────────────────────────────────────────────────────
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        # API Endpoints
        if path.startswith("/api/"):
            self._handle_api_get(path, query)
            return

        # Static Frontend Serving
        if path == "/" or path == "":
            self.path = "/index.html"
        return super().do_GET()

    def _handle_api_get(self, path: str, query: Dict[str, List[str]]):
        conn = get_connection()
        cursor = conn.cursor()

        try:
            if path == "/api/health":
                self._send_json({
                    "status": "healthy",
                    "engine": "PhoenixLearn Adaptive Core",
                    "database": "SQLite3 Active",
                    "gemini_model": "gemini-3.8-flash",
                    "version": "1.0.0"
                })

            elif path == "/api/user":
                user_id = query.get("user_id", ["user-demo-1"])[0]
                user = get_user_by_id(user_id)
                if not user:
                    user = get_user_by_id("user-demo-1")
                learning_state = AdaptiveEngine.get_user_learning_state(user['id'])
                self._send_json({
                    "user": user,
                    "learning_state": learning_state
                })

            elif path == "/api/auth/profiles":
                profiles = get_all_profiles()
                self._send_json({"profiles": profiles, "count": len(profiles)})

            elif path == "/api/subjects":
                cursor.execute("SELECT * FROM subjects")
                subjects = [dict(r) for r in cursor.fetchall()]
                self._send_json({"subjects": subjects})

            elif path == "/api/questions":
                subject = query.get("subject", [None])[0]
                difficulty = query.get("difficulty", [None])[0]

                sql = "SELECT * FROM questions WHERE 1=1"
                params = []
                if subject:
                    sql += " AND subject_id = ?"
                    params.append(subject)
                if difficulty:
                    sql += " AND difficulty = ?"
                    params.append(difficulty)

                cursor.execute(sql, params)
                rows = cursor.fetchall()
                questions = []
                for r in rows:
                    q = dict(r)
                    q['options'] = json.loads(q['options'])
                    q['tags'] = json.loads(q['tags']) if q['tags'] else []
                    questions.append(q)

                self._send_json({"questions": questions, "count": len(questions)})

            elif path == "/api/knowledge-gaps":
                user_id = query.get("user_id", ["user-demo-1"])[0]
                gaps = AdaptiveEngine.get_user_learning_state(user_id)
                self._send_json(gaps)

            elif path == "/api/contests":
                cursor.execute("SELECT * FROM contests")
                contests = [dict(r) for r in cursor.fetchall()]
                cursor.execute("SELECT * FROM leaderboard ORDER BY xp DESC LIMIT 10")
                leaders = [dict(r) for r in cursor.fetchall()]
                self._send_json({"contests": contests, "leaderboard": leaders})

            elif path == "/api/assignments":
                cursor.execute("SELECT * FROM assignments ORDER BY urgency DESC")
                asgs = [dict(r) for r in cursor.fetchall()]
                self._send_json({"assignments": asgs})

            else:
                self._send_json({"error": f"API endpoint '{path}' not found"}, 404)

        finally:
            conn.close()

    # ─── POST ROUTES ────────────────────────────────────────────────────────────
    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._parse_json_body()

        # ─── Multi-User & Google OAuth Routes ───
        if path == "/api/auth/google":
            google_id = body.get("google_id") or body.get("sub") or f"g-{uuid.uuid4().hex[:10]}"
            email = body.get("email")
            name = body.get("name") or "Google Scholar"
            avatar_url = body.get("avatar_url") or body.get("picture")

            if not email:
                self._send_json({"error": "Google email is required"}, 400)
                return

            user = create_or_get_google_user(google_id, email, name, avatar_url)
            learning_state = AdaptiveEngine.get_user_learning_state(user['id'])
            self._send_json({
                "success": True,
                "message": f"Welcome back, {user['name']}!",
                "user": user,
                "learning_state": learning_state
            })

        elif path == "/api/auth/register":
            name = body.get("name")
            email = body.get("email")
            password = body.get("password", "phoenix123")
            class_level = int(body.get("class_level", 11))
            phone = body.get("phone", "")
            target_exam = body.get("target_exam", "JEE Main & Advanced")
            selected_subjects = body.get("selected_subjects", ["mathematics", "physics", "chemistry"])

            if not name or not email:
                self._send_json({"error": "Name and email are required"}, 400)
                return

            try:
                user = register_user(name, email, password, class_level, phone, target_exam, selected_subjects)
                learning_state = AdaptiveEngine.get_user_learning_state(user['id'])
                self._send_json({
                    "success": True,
                    "message": "Profile created successfully!",
                    "user": user,
                    "learning_state": learning_state
                })
            except ValueError as ve:
                self._send_json({"error": str(ve)}, 409)

        elif path == "/api/auth/login":
            email = body.get("email")
            password = body.get("password")
            if not email:
                self._send_json({"error": "Email is required"}, 400)
                return

            user = authenticate_user(email, password)
            if user:
                learning_state = AdaptiveEngine.get_user_learning_state(user['id'])
                self._send_json({
                    "success": True,
                    "message": f"Signed in as {user['name']}",
                    "user": user,
                    "learning_state": learning_state
                })
            else:
                self._send_json({"error": "Invalid email or credentials"}, 401)

        elif path == "/api/auth/switch":
            user_id = body.get("user_id")
            user = get_user_by_id(user_id)
            if user:
                learning_state = AdaptiveEngine.get_user_learning_state(user['id'])
                self._send_json({
                    "success": True,
                    "message": f"Switched to profile: {user['name']}",
                    "user": user,
                    "learning_state": learning_state
                })
            else:
                self._send_json({"error": "Profile not found"}, 404)

        elif path == "/api/user/update":
            user_id = body.get("user_id")
            updates = body.get("updates", {})
            if not user_id:
                self._send_json({"error": "User ID required"}, 400)
                return

            updated_user = update_user_profile(user_id, updates)
            self._send_json({
                "success": True,
                "message": "Profile preferences updated",
                "user": updated_user
            })

        elif path == "/api/copilot":
            message = body.get("message", "")
            image_base64 = body.get("image_base64")
            context = body.get("context", "")

            response = GeminiService.ask_copilot(message, image_base64, context)
            self._send_json(response)

        elif path == "/api/quiz/submit":
            user_id = body.get("user_id", "user-demo-1")
            topic_id = body.get("topic_id", "math-t9")
            score_percent = float(body.get("score_percent", 0.0))
            time_spent = int(body.get("time_spent_seconds", 120))
            responses = body.get("responses", [])

            result = AdaptiveEngine.process_quiz_submission(
                user_id=user_id,
                topic_id=topic_id,
                score_percent=score_percent,
                time_spent_seconds=time_spent,
                question_responses=responses
            )
            self._send_json(result)

        elif path == "/api/streak/sync":
            user_id = body.get("user_id", "user-demo-1")
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT streak FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            streak = row['streak'] if row else 7
            conn.close()
            self._send_json({"success": True, "streak": streak, "status": "active"})

        else:
            self._send_json({"error": f"POST endpoint '{path}' not found"}, 404)

def run_server(port=3000):
    init_db()
    server_address = ("0.0.0.0", port)
    httpd = ThreadedHTTPServer(server_address, PhoenixServerHandler)
    print(f"🔥 PhoenixLearn Backend Server listening on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    run_server(port)
