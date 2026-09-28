# 🔥 PhoenixLearn — The Intelligent Adaptive Learning Universe

> **Inspired by Brilliant.org & Duolingo • Engineered for Indian & Global Academics (RD Sharma Class 9–12, JEE Main & Advanced, NEET, Coding)**

PhoenixLearn is a full-stack, AI-driven adaptive education platform that continuously analyzes student responses, pinpoints individual knowledge gaps and misconceptions, and dynamically provides personalized interventions, 3D simulations, and gamified mastery paths.

---

## 🌟 Key Architecture & Highlights

### 1. 🦅 The Phoenix Companion & Theme
- **Dignified Companion**: Unlike childish cartoon mascots, Phoenix is an original majestic fire-phoenix representing intellect, rebirth, and wisdom.
- **Side Chatter & Mentor**: Floating companion providing contextual time-of-day encouragement, study streaks check, motivation, and celebration animations without being intrusive.
- **Deep Ember Theme**: Neon orange (`#ff6b35`), radiant amber (`#ffb347`), crimson (`#ff2d55`), and obsidian void (`#0a0a0f`) with glassmorphism and animated particle embers.

### 2. 🎬 Marvel Cinematic Subject Intros (`MarvelIntro.tsx`)
- Every discipline (Mathematics, Physics, Chemistry, Biology, Computer Science) features a custom, high-octane intro sequence with comic-book formula page flicks, shockwave emblem slams, glitch effects, and symbol reveals.

### 3. 📚 Deep Curriculum & RD Sharma Integration
- **Mathematics**: Class 9–12 syllabus mapped from RD Sharma — Sets, Complex Numbers, Quadratic Equations, Sequences & Series, Trigonometry, Limits, Differential & Integral Calculus, Matrices & Vectors.
- **Physics**: NCERT & HC Verma concepts (Kinematics, Newton's Laws, Friction, Energy, Waves & SHM, Electrostatics).
- **Chemistry**: Physical, Organic, and Inorganic concepts (Mole Concept, Bohr Model, Quantum Numbers, Thermodynamics).
- **Computer Science & Coding**: Python basics, OOP, Data Structures (Arrays, Linked Lists, Trees, Graphs), Sorting Algorithms, and Big-O Analysis.
- **Seamless JEE Integration**: No segregated isolation for JEE; questions are tagged by difficulty from Easy to Hard and JEE PYQs, allowing learners to progress naturally.

### 4. 🤖 24/7 AI Copilot with Photo Doubt Solving (`gemini-3.8-flash`)
- **Interactions API Driven**: Uses Google Gemini's latest API (`gemini-3.8-flash`) for multi-turn academic doubt solving.
- **Multimodal Image Doubts**: Upload camera photos or textbook screenshots for step-by-step problem breakdown.
- **Full LaTeX Math & Code**: Rendered in real-time with KaTeX and syntax-highlighted code blocks.
- **AI Recommendation Engine**: Dynamically curates relevant YouTube video lectures from top channels (3Blue1Brown, Physics Wallah, Khan Academy) tailored to fill the student's specific misconception.

### 5. 🕸️ 3D Knowledge Synapse Map (`/knowledge-map`)
- Interactive, draggable, and zoomable constellation of concepts.
- **Knowledge Gap Detection**: Weak nodes pulse with red beacons identifying where the student's mastery dropped below 50%.
- **Targeted Interventions**: Click any node to open the inspector drawer and launch immediate micro-learning sessions.

### 6. 🔬 Interactive 3D & Physics Simulations (`/simulations`)
- TryHackMe-style hands-on conceptual labs.
- **Simple Harmonic Motion Lab**: Interactive pendulum with real-time length ($L$), gravity ($g$), and angle ($\theta$) controls with dynamic calculation of $T = 2\pi\sqrt{L/g}$ and animated phase trajectories.
- Additional modules for Projectile Motion, Electric Circuits, and Sorting Algorithm visualizers.

### 7. 📖 Dual 2D & 3D Spatial Notes Viewer (`/notes`)
- Toggle between clean 2D reading, 3D interactive flipping book mode with page shadows, and embedded PDF formats.

### 8. 🏆 Phoenix Arena & Contests (`/contest`)
- Live timed assessment tournaments with countdown clocks.
- Global Hall of Fame leaderboard with weekly and all-time student rankings.

### 9. 🔥 Streak Shield & Adaptive Mastery Path
- Duolingo-style level progression along the **Phoenix Path** (from Spark to Phoenix Sovereign).
- Daily quizzes, XP multipliers, flame animations, and achievement badges.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom Phoenix color scales, neon glow filters, and responsive grids
- **Animations**: Framer Motion, CSS Keyframe 3D Transforms, Canvas Particle Engine
- **Math & Equations**: KaTeX (`react-katex`, `remark-math`, `rehype-katex`)
- **AI / LLM**: `@google/genai` (Gemini 3.8 Flash Interactions API)
- **State Management**: Zustand with persistent storage (`useUserStore`, `useProgress`, `useStreak`)
- **Icons & Visuals**: Lucide Icons, bespoke SVG Phoenix mascot

---

## 🚀 Getting Started

1. **Set Environment Variables**:
   Copy or configure `.env.local`:
   ```bash
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Visit the Platform**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.
