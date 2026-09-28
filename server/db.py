import sqlite3
import json
import os
from typing import Dict, Any, List, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "phoenix.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Users Table (Supports Google OAuth, Multi-profile, Target Exam)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        google_id TEXT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        class_level INTEGER DEFAULT 11,
        phone TEXT,
        target_exam TEXT DEFAULT 'JEE Main & Advanced',
        selected_subjects TEXT DEFAULT '["mathematics","physics","chemistry"]',
        daily_goal_minutes INTEGER DEFAULT 45,
        streak INTEGER DEFAULT 7,
        total_xp INTEGER DEFAULT 2840,
        level INTEGER DEFAULT 4,
        avatar TEXT DEFAULT '🦅',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Ensure column migrations for existing databases
    for col, col_type in [
        ('google_id', 'TEXT'),
        ('password_hash', 'TEXT'),
        ('phone', 'TEXT'),
        ('target_exam', 'TEXT DEFAULT "JEE Main & Advanced"'),
        ('selected_subjects', 'TEXT DEFAULT \'["mathematics","physics","chemistry"]\''),
        ('daily_goal_minutes', 'INTEGER DEFAULT 45'),
        ('avatar_url', 'TEXT'),
        ('last_login', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    ]:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {col_type}")
        except sqlite3.OperationalError:
            pass # Column already exists

    # Subjects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        description TEXT,
        total_chapters INTEGER DEFAULT 20
    )
    """)

    # Topics Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        subject_id TEXT NOT NULL,
        chapter_name TEXT NOT NULL,
        name TEXT NOT NULL,
        theory TEXT NOT NULL,
        difficulty TEXT DEFAULT 'medium',
        order_index INTEGER DEFAULT 1,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
    """)

    # Questions Table (RD Sharma 9-12, HC Verma, JEE PYQs)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        subject_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        text TEXT NOT NULL,
        options TEXT NOT NULL, -- JSON array
        correct_answer INTEGER NOT NULL,
        explanation TEXT NOT NULL,
        difficulty TEXT DEFAULT 'medium', -- easy, medium, hard, jee
        source TEXT,
        tags TEXT -- JSON array
    )
    """)

    # User Progress & Topic Mastery
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_progress (
        user_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        mastery INTEGER DEFAULT 0, -- 0 to 100
        last_score INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        time_spent_seconds INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
        last_studied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, topic_id)
    )
    """)

    # Knowledge Gaps & Misconceptions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_gaps (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        misconception_summary TEXT NOT NULL,
        mastery_level INTEGER NOT NULL,
        suggested_intervention TEXT NOT NULL,
        status TEXT DEFAULT 'active', -- active, remediated
        identified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Contests & Leaderboards
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contests (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        duration_minutes INTEGER DEFAULT 45,
        total_questions INTEGER DEFAULT 25,
        prize_xp INTEGER DEFAULT 1000,
        status TEXT DEFAULT 'live'
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        class_level TEXT NOT NULL,
        xp INTEGER NOT NULL,
        streak INTEGER NOT NULL,
        avatar TEXT NOT NULL,
        title TEXT NOT NULL
    )
    """)

    # Assignments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assignments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        chapter TEXT NOT NULL,
        questions_count INTEGER DEFAULT 15,
        due_date TEXT NOT NULL,
        urgency TEXT DEFAULT 'normal', -- normal, medium, high
        status TEXT DEFAULT 'pending', -- pending, completed
        xp_reward INTEGER DEFAULT 250
    )
    """)

    # Copilot Chat Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS copilot_chats (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL, -- user, assistant
        content TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Seed initial data if empty
    seed_data(conn)
    conn.close()

def seed_data(conn):
    cursor = conn.cursor()

    # Seed Default User
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO users (id, name, email, class_level, streak, total_xp, level, avatar)
        VALUES ('user-demo-1', 'Phoenix Scholar', 'scholar@phoenixlearn.app', 12, 7, 2840, 4, '🦅')
        """)

    # Seed Subjects
    cursor.execute("SELECT COUNT(*) FROM subjects")
    if cursor.fetchone()[0] == 0:
        subjects = [
            ('mathematics', 'Mathematics', 'Math', '∫', '#ff6b35', 'RD Sharma Class 9-12, Algebra, Calculus & JEE PYQs', 28),
            ('physics', 'Physics', 'Phy', '⚛', '#0a84ff', 'HC Verma Concepts, Mechanics, Waves & Electrostatics', 20),
            ('chemistry', 'Chemistry', 'Chem', '⚗', '#30d158', 'NCERT & OP Tandon Physical, Organic & Inorganic', 22),
            ('computer-science', 'Computer Science', 'CS', '</>', '#bf5af2', 'Python, OOP, Data Structures & Algorithms', 16)
        ]
        cursor.executemany("INSERT INTO subjects VALUES (?, ?, ?, ?, ?, ?, ?)", subjects)

    # Seed Questions
    cursor.execute("SELECT COUNT(*) FROM questions")
    if cursor.fetchone()[0] == 0:
        questions = [
            (
                'math-q1', 'mathematics', 'math-t1',
                'Let A = {x ∈ ℝ : x² - 5x + 6 = 0} and B = {2, 3}. What is the relationship between set A and set B?',
                json.dumps(['A ⊂ B but A ≠ B', 'B ⊂ A but B ≠ A', 'A = B', 'A ∩ B = ∅']),
                2,
                'Factoring x² - 5x + 6 = 0 yields (x - 2)(x - 3) = 0, so x = 2, 3. Therefore, set A is identical to set B.',
                'easy',
                'RD Sharma Class 11 - Chapter 1',
                json.dumps(['Sets', 'Algebra'])
            ),
            (
                'math-q2', 'mathematics', 'math-t9',
                'If α and β are the roots of ax² + bx + c = 0, what is the exact value of (1/α²) + (1/β²)?',
                json.dumps(['(b² + 2ac) / c²', '(b² - 2ac) / c²', '(b² - 4ac) / a²', '(2ac - b²) / a²']),
                1,
                'Using Vieta formulas: α+β = -b/a, αβ = c/a. (1/α²) + (1/β²) = (α²+β²)/(αβ)² = ((α+β)² - 2αβ)/(αβ)² = (b² - 2ac)/c².',
                'medium',
                'RD Sharma Class 11 - Chapter 8',
                json.dumps(['Quadratic Equations', 'Vieta Theorems'])
            ),
            (
                'math-q3', 'mathematics', 'math-t6',
                'If z = (1 + i√3) / (1 - i√3), what is the principal argument Arg(z) in radians?',
                json.dumps(['π/3', '2π/3', '-2π/3', '5π/6']),
                1,
                'Rationalizing: z = (1 + i√3)² / (1+3) = (-2 + 2i√3)/4 = -1/2 + i(√3/2). Since x < 0 and y > 0, Arg(z) = π - π/3 = 2π/3.',
                'hard',
                'RD Sharma Class 11 - Chapter 13',
                json.dumps(['Complex Numbers', 'Argand Plane', 'JEE Main'])
            ),
            (
                'phy-q1', 'physics', 'phy-t2',
                'A projectile is launched from ground level with speed u at angle θ. If its maximum height equals horizontal range, what is tan(θ)?',
                json.dumps(['1', '2', '4', '1/4']),
                2,
                'Max height H = (u² sin²θ)/(2g). Range R = (2u² sinθ cosθ)/g. Equating H = R yields tan(θ) = 4.',
                'medium',
                'HC Verma Concepts of Physics Vol 1 Ch 3',
                json.dumps(['Kinematics', 'Projectile Motion'])
            ),
            (
                'phy-q2', 'physics', 'phy-t4',
                '[JEE Trap] A block of mass 2 kg rests on a rough floor with μ_s = 0.5. A force of 6 N is applied horizontally. What is the frictional force? (g = 9.8 m/s²)',
                json.dumps(['9.8 N', '6 N', '0 N', '4.9 N']),
                1,
                'Max static friction = μ_s * N = 0.5 * 2 * 9.8 = 9.8 N. Since applied force 6 N < 9.8 N, static friction self-adjusts to exactly 6 N to prevent motion.',
                'hard',
                'HC Verma Vol 1 Ch 6 Friction',
                json.dumps(['Friction', 'Laws of Motion', 'JEE Main'])
            )
        ]
        cursor.executemany("INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", questions)

    # Seed Knowledge Gaps
    cursor.execute("SELECT COUNT(*) FROM knowledge_gaps")
    if cursor.fetchone()[0] == 0:
        gaps = [
            ('gap-1', 'user-demo-1', 'math-t6', 'Difficulty with principal argument calculation when real part is negative in Argand Plane', 42, 'Review RD Sharma Section 13.4 and practice 5 Argand plane quadrant tests', 'active'),
            ('gap-2', 'user-demo-1', 'phy-t4', 'Confusion between threshold static friction (μ_s N) and actual static resistance force', 48, 'Interactive experiment in Physics Lab with normal load variations', 'active')
        ]
        cursor.executemany("INSERT INTO knowledge_gaps VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", gaps)

    # Seed Leaderboard
    cursor.execute("SELECT COUNT(*) FROM leaderboard")
    if cursor.fetchone()[0] == 0:
        leaders = [
            ('Aarav Sharma', 'Class 12', 14500, 42, '🦅', 'Phoenix Sovereign'),
            ('Diya Patel', 'Class 12', 13920, 35, '⚡', 'Solar Blaze'),
            ('Rohan Verma', 'Class 11', 12840, 28, '🔥', 'Crimson Wing'),
            ('Ananya Roy', 'Class 11', 11400, 21, '🌟', 'Rising Ember'),
            ('Ishaan Gupta', 'Class 10', 9850, 19, '✨', 'Kindling Flame')
        ]
        cursor.executemany("INSERT INTO leaderboard (user_name, class_level, xp, streak, avatar, title) VALUES (?, ?, ?, ?, ?, ?)", leaders)

    # Seed Assignments
    cursor.execute("SELECT COUNT(*) FROM assignments")
    if cursor.fetchone()[0] == 0:
        asgs = [
            ('asg-1', 'RD Sharma Calculus Problem Set 1', 'Mathematics', 'Limits & Derivatives', 15, 'Today, 11:59 PM', 'high', 'pending', 300),
            ('asg-2', 'Newton Laws & Friction Free Body Diagrams', 'Physics', 'Laws of Motion', 10, 'Tomorrow, 6:00 PM', 'medium', 'pending', 200),
            ('asg-3', 'Stoichiometry & Limiting Reagents Lab', 'Chemistry', 'Basic Concepts', 12, 'Completed 2 days ago', 'normal', 'completed', 250)
        ]
        cursor.executemany("INSERT INTO assignments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", asgs)

    conn.commit()

# ─── MULTI-USER PROFILE & AUTH HELPERS ───────────────────────────────────────

import uuid
import hashlib

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def create_or_get_google_user(google_id: str, email: str, name: str, avatar_url: Optional[str] = None) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check by google_id or email
    cursor.execute("SELECT * FROM users WHERE google_id = ? OR email = ?", (google_id, email))
    row = cursor.fetchone()
    
    if row:
        user = dict(row)
        # Update google_id and last_login if needed
        cursor.execute("UPDATE users SET google_id = ?, avatar_url = COALESCE(?, avatar_url), last_login = CURRENT_TIMESTAMP WHERE id = ?", (google_id, avatar_url, user['id']))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user['id'],))
        updated_user = dict(cursor.fetchone())
        conn.close()
        return updated_user
    
    # Create new profile from Google OAuth
    new_id = f"user-{uuid.uuid4().hex[:8]}"
    avatar = '🦅'
    cursor.execute("""
    INSERT INTO users (id, google_id, name, email, class_level, target_exam, selected_subjects, streak, total_xp, level, avatar, avatar_url, last_login)
    VALUES (?, ?, ?, ?, 11, 'JEE Main & Advanced', '["mathematics","physics","chemistry"]', 1, 100, 1, ?, ?, CURRENT_TIMESTAMP)
    """, (new_id, google_id, name, email, avatar, avatar_url))
    conn.commit()
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (new_id,))
    new_user = dict(cursor.fetchone())
    conn.close()
    return new_user

def register_user(name: str, email: str, password: str, class_level: int = 11, phone: str = "", target_exam: str = "JEE Main & Advanced", selected_subjects: List[str] = None) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        raise ValueError("An account with this email already exists.")
        
    new_id = f"user-{uuid.uuid4().hex[:8]}"
    pwd_hash = hash_password(password)
    subj_json = json.dumps(selected_subjects or ["mathematics", "physics", "chemistry"])
    
    cursor.execute("""
    INSERT INTO users (id, name, email, password_hash, class_level, phone, target_exam, selected_subjects, streak, total_xp, level, avatar, last_login)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 100, 1, '🦅', CURRENT_TIMESTAMP)
    """, (new_id, name, email, pwd_hash, class_level, phone, target_exam, subj_json))
    conn.commit()
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (new_id,))
    user = dict(cursor.fetchone())
    conn.close()
    return user

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    pwd_hash = hash_password(password)
    
    cursor.execute("SELECT * FROM users WHERE email = ? AND (password_hash = ? OR password_hash IS NULL)", (email, pwd_hash))
    row = cursor.fetchone()
    if row:
        user = dict(row)
        cursor.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (user['id'],))
        conn.commit()
        conn.close()
        return user
    conn.close()
    return None

def get_all_profiles() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, class_level, target_exam, selected_subjects, streak, total_xp, level, avatar, avatar_url, last_login FROM users ORDER BY last_login DESC")
    rows = cursor.fetchall()
    profiles = []
    for r in rows:
        d = dict(r)
        if d.get('selected_subjects'):
            try:
                d['selected_subjects'] = json.loads(d['selected_subjects'])
            except:
                d['selected_subjects'] = ["mathematics", "physics", "chemistry"]
        profiles.append(d)
    conn.close()
    return profiles

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        d = dict(row)
        if d.get('selected_subjects'):
            try:
                d['selected_subjects'] = json.loads(d['selected_subjects'])
            except:
                d['selected_subjects'] = ["mathematics", "physics", "chemistry"]
        return d
    return None

def update_user_profile(user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    allowed_fields = ['name', 'class_level', 'target_exam', 'phone', 'selected_subjects', 'daily_goal_minutes', 'avatar']
    set_clauses = []
    params = []
    
    for field in allowed_fields:
        if field in updates:
            val = updates[field]
            if field == 'selected_subjects' and isinstance(val, list):
                val = json.dumps(val)
            set_clauses.append(f"{field} = ?")
            params.append(val)
            
    if set_clauses:
        params.append(user_id)
        sql = f"UPDATE users SET {', '.join(set_clauses)} WHERE id = ?"
        cursor.execute(sql, params)
        conn.commit()
        
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = dict(cursor.fetchone())
    conn.close()
    return user

if __name__ == "__main__":
    init_db()
    print("PhoenixLearn SQLite Database initialized successfully at", DB_FILE)
