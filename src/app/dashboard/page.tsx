'use client';

import { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const USER = {
  name: 'Arjun',
  avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=phoenix',
  level: 12,
  xp: 3_420,
  xpForNext: 4_000,
  streak: 14,
  rank: 23,
  totalStudents: 8_400,
};

const STATS = [
  { label: 'Topics Completed', value: 148, suffix: '', icon: '📚', color: 'from-violet-500 to-purple-600' },
  { label: 'Accuracy', value: 87, suffix: '%', icon: '🎯', color: 'from-emerald-400 to-teal-600' },
  { label: 'Quiz Score Avg', value: 91, suffix: '%', icon: '🏆', color: 'from-amber-400 to-orange-500' },
  { label: 'Rank', value: 23, suffix: '', prefix: '#', icon: '⚡', color: 'from-sky-400 to-blue-600' },
];

const SUBJECTS = [
  {
    id: 1,
    name: 'Physics',
    icon: '⚛️',
    progress: 68,
    chaptersCompleted: 17,
    chaptersTotal: 25,
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/30',
    lastTopic: 'Electrostatics',
  },
  {
    id: 2,
    name: 'Chemistry',
    icon: '🧪',
    progress: 54,
    chaptersCompleted: 13,
    chaptersTotal: 24,
    gradient: 'from-emerald-600 via-green-500 to-teal-400',
    shadow: 'shadow-emerald-500/30',
    lastTopic: 'Organic Reactions',
  },
  {
    id: 3,
    name: 'Mathematics',
    icon: '📐',
    progress: 75,
    chaptersCompleted: 18,
    chaptersTotal: 24,
    gradient: 'from-violet-600 via-purple-500 to-pink-400',
    shadow: 'shadow-violet-500/30',
    lastTopic: 'Calculus',
  },
  {
    id: 4,
    name: 'Biology',
    icon: '🌿',
    progress: 42,
    chaptersCompleted: 10,
    chaptersTotal: 24,
    gradient: 'from-amber-500 via-orange-500 to-red-400',
    shadow: 'shadow-amber-500/30',
    lastTopic: 'Cell Biology',
  },
  {
    id: 5,
    name: 'English',
    icon: '📖',
    progress: 83,
    chaptersCompleted: 15,
    chaptersTotal: 18,
    gradient: 'from-rose-600 via-pink-500 to-fuchsia-400',
    shadow: 'shadow-rose-500/30',
    lastTopic: 'Grammar',
  },
  {
    id: 6,
    name: 'History',
    icon: '🏛️',
    progress: 31,
    chaptersCompleted: 7,
    chaptersTotal: 22,
    gradient: 'from-yellow-600 via-amber-500 to-orange-400',
    shadow: 'shadow-yellow-500/30',
    lastTopic: 'World War II',
  },
];

const RADAR_DATA = [
  { subject: 'Physics', A: 85, fullMark: 100 },
  { subject: 'Chemistry', A: 62, fullMark: 100 },
  { subject: 'Maths', A: 90, fullMark: 100 },
  { subject: 'Biology', A: 45, fullMark: 100 },
  { subject: 'English', A: 78, fullMark: 100 },
  { subject: 'History', A: 38, fullMark: 100 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Priya S.', xp: 12_800, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya', badge: '👑' },
  { rank: 2, name: 'Rohan M.', xp: 11_340, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rohan', badge: '🥈' },
  { rank: 3, name: 'Sneha K.', xp: 10_900, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sneha', badge: '🥉' },
  { rank: 4, name: 'Vikram P.', xp: 9_750, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=vikram', badge: '' },
  { rank: 5, name: 'Ananya R.', xp: 9_200, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ananya', badge: '' },
  { rank: 23, name: 'Arjun (You)', xp: 3_420, avatar: USER.avatar, badge: '', isUser: true },
];

const AI_RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Electrostatics Full Chapter — JEE 2025',
    channel: 'Physics Wallah',
    thumbnail: 'https://img.youtube.com/vi/RMOaNkGGEoA/maxresdefault.jpg',
    duration: '1:24:10',
    reason: 'You scored 58% on Electrostatics last quiz — this lecture covers all weak spots.',
    tag: 'Weak Area',
    tagColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
  },
  {
    id: 2,
    title: 'Organic Chemistry Mechanisms Crash Course',
    channel: 'Unacademy JEE',
    thumbnail: 'https://img.youtube.com/vi/t_wdBSqMCZc/maxresdefault.jpg',
    duration: '58:42',
    reason: 'Builds on Inorganic you mastered — completing Organic will unlock next milestone.',
    tag: 'Next Milestone',
    tagColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  },
  {
    id: 3,
    title: 'Calculus Integration — 100 Problems Solved',
    channel: 'Vedantu Math',
    thumbnail: 'https://img.youtube.com/vi/Tj7I1tn0e3Y/maxresdefault.jpg',
    duration: '2:02:35',
    reason: "You're 75% through Calculus — this will push you to 100% before your exam.",
    tag: 'Goal Push',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  },
];

const SCHEDULE = [
  { id: 1, type: 'quiz', label: 'Daily Quiz', subtitle: 'Physics · 10 questions', icon: '🎯', countdownSec: 8400, done: false, color: 'from-violet-500 to-purple-600' },
  { id: 2, type: 'contest', label: 'JEE Mock Contest', subtitle: 'Starts in', icon: '🏆', countdownSec: 27_600, done: false, color: 'from-amber-500 to-orange-500' },
  { id: 3, type: 'assignment', label: 'Organic Chemistry Assignment', subtitle: '5 problems pending', icon: '📝', countdownSec: 0, done: false, color: 'from-rose-500 to-pink-600' },
];

const PHOENIX_LEVELS = Array.from({ length: 20 }, (_, i) => ({
  level: i + 1,
  completed: i + 1 < USER.level,
  current: i + 1 === USER.level,
  label: i + 1 <= 5 ? 'Spark' : i + 1 <= 10 ? 'Flame' : i + 1 <= 15 ? 'Blaze' : 'Phoenix',
}));

const MOTIVATIONAL_QUOTES = [
  'Every expert was once a beginner. Keep igniting! 🔥',
  'You are 14 days stronger than you were. Rise higher!',
  'Consistency beats talent every single time.',
  'The phoenix rises — and so do you. 🚀',
];

const NAV_LINKS = ['Dashboard', 'Subjects', 'Learn', 'Quiz', 'Contests', 'Notes', 'Simulations', 'Knowledge Map'];

// ─── Utility Hooks ────────────────────────────────────────────────────────────

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function useAnimatedCounter(target: number, duration = 1.8) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return controls.stop;
  }, [target, duration]);
  return value;
}

function useCountdown(initialSec: number) {
  const [sec, setSec] = useState(initialSec);
  useEffect(() => {
    if (sec <= 0) return;
    const t = setInterval(() => setSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const count = useAnimatedCounter(value);
  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

function ProgressBar({ value, color = 'from-violet-500 to-purple-400', height = 'h-2' }: { value: number; color?: string; height?: string }) {
  return (
    <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  );
}

function GoalRing({ progress }: { progress: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress / 100);
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} strokeWidth="8" stroke="rgba(255,255,255,0.1)" fill="none" />
        <motion.circle
          cx="48" cy="48" r={r}
          strokeWidth="8"
          stroke="url(#goalGrad)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <div className="text-lg font-bold text-white">{progress}%</div>
        <div className="text-[10px] text-white/60">Goal</div>
      </div>
    </div>
  );
}

function FlameIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.15, 1], rotate: [-3, 3, -3] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      className={`inline-block text-${size === 24 ? '2xl' : 'base'} ${className}`}
      style={{ fontSize: size }}
    >
      🔥
    </motion.span>
  );
}

function CountdownTimer({ initialSec }: { initialSec: number }) {
  const display = useCountdown(initialSec);
  return <span className="font-mono font-bold text-amber-400">{display}</span>;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ notifOpen, setNotifOpen }: { notifOpen: boolean; setNotifOpen: (v: boolean) => void }) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#0a0a1a]/80 border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          whileHover={{ scale: 1.04 }}
        >
          <FlameIcon size={28} />
          <span className="text-xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent tracking-tight">
            PhoenixLearn
          </span>
        </motion.div>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
          {NAV_LINKS.map((link) => (
            <motion.button
              key={link}
              onClick={() => setActivePage(link)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activePage === link
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {activePage === link && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link}</span>
            </motion.button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          {/* Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hidden sm:flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5"
          >
            <FlameIcon size={16} />
            <span className="text-sm font-bold text-orange-400">{USER.streak}</span>
            <span className="text-xs text-white/40">days</span>
          </motion.div>

          {/* XP bar */}
          <div className="hidden md:flex flex-col gap-0.5 min-w-[90px]">
            <div className="flex justify-between text-[10px] text-white/50">
              <span>Lv.{USER.level}</span>
              <span>{USER.xp.toLocaleString()} XP</span>
            </div>
            <ProgressBar value={(USER.xp / USER.xpForNext) * 100} color="from-amber-400 to-orange-500" height="h-1.5" />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setNotifOpen(!notifOpen); setAvatarOpen(false); }}
              className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-[#12122a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  {['Daily Quiz unlocked 🎯', 'You ranked up to #23 ⚡', 'New contest: JEE Mock 🏆', 'Arjun mentioned you in Notes'].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0">
                      <p className="text-sm text-white/80">{n}</p>
                      <p className="text-xs text-white/30 mt-0.5">{i === 0 ? 'Just now' : `${i * 15}m ago`}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setAvatarOpen(!avatarOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 rounded-full"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-violet-500/40">
                {USER.name[0]}
              </div>
            </motion.button>
            <AnimatePresence>
              {avatarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-52 bg-[#12122a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="font-semibold text-white">{USER.name}</p>
                    <p className="text-xs text-white/40">Level {USER.level} · {USER.xp.toLocaleString()} XP</p>
                  </div>
                  {['Profile', 'Settings', 'Study Plan', 'Sign Out'].map((item) => (
                    <button key={item} className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const greeting = useGreeting();
  const xpPct = Math.round((USER.xp / USER.xpForNext) * 100);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0533] via-[#0f0f2e] to-[#0a1628] border border-white/5 p-8 mb-8">
      {/* Background glow blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex-1 min-w-0">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-sm mb-1 font-medium"
          >
            {greeting},
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight"
          >
            {USER.name}! <span className="text-white/30">✨</span>
          </motion.h1>

          {/* Streak + XP Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            {/* Streak badge */}
            <div className="flex items-center gap-2 bg-orange-500/15 border border-orange-500/25 rounded-2xl px-4 py-2">
              <FlameIcon size={20} />
              <div>
                <span className="text-lg font-extrabold text-orange-400">{USER.streak}</span>
                <span className="text-sm text-white/50 ml-1">day streak</span>
              </div>
            </div>

            {/* XP bar */}
            <div className="flex-1 min-w-[200px] max-w-xs">
              <div className="flex justify-between text-xs text-white/50 mb-1.5">
                <span className="font-semibold text-white/80">Level {USER.level}</span>
                <span>{USER.xp.toLocaleString()} / {USER.xpForNext.toLocaleString()} XP</span>
              </div>
              <div className="relative">
                <ProgressBar value={xpPct} color="from-amber-400 via-orange-500 to-red-500" height="h-3" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-amber-400 rounded-full border-2 border-[#0f0f2e] shadow-lg shadow-amber-500/50"
                />
              </div>
              <p className="text-xs text-white/40 mt-1">{USER.xpForNext - USER.xp} XP to Level {USER.level + 1}</p>
            </div>
          </motion.div>

          {/* Today's goal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex items-center gap-4"
          >
            <GoalRing progress={62} />
            <div>
              <p className="text-sm font-semibold text-white/80">Today's Goal</p>
              <p className="text-xs text-white/40">3 of 5 topics done · 2 remaining</p>
              <div className="flex gap-1.5 mt-2">
                {['Electrostatics ✅', 'Calculus ✅', 'History', 'Organic Chem', 'Grammar'].map((t, i) => (
                  <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.includes('✅') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                    {t.replace(' ✅', '')} {t.includes('✅') && '✓'}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Phoenix Character + Quote */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 20 }}
          className="shrink-0 flex flex-col items-center gap-4 lg:mr-4"
        >
          {/* Phoenix avatar */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-200 flex items-center justify-center text-6xl lg:text-7xl shadow-2xl shadow-orange-500/40">
              🦅
            </div>
            {/* Glow ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute inset-0 rounded-full bg-orange-400/30 blur-xl -z-10"
            />
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-sm font-extrabold text-white shadow-lg shadow-orange-500/50 border-2 border-[#0f0f2e]">
              {USER.level}
            </div>
          </motion.div>

          {/* Quote bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-3 max-w-[220px] text-center"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
              <div className="w-4 h-4 bg-white/5 border-l border-t border-white/10 rotate-45 translate-y-1 mx-auto" />
            </div>
            <p className="text-xs text-white/70 italic leading-relaxed">
              {MOTIVATIONAL_QUOTES[quoteIdx]}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 * idx, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="relative overflow-hidden rounded-2xl bg-[#0d0d22] border border-white/5 p-5 cursor-pointer group"
        >
          {/* Gradient overlay on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />
          <div className={`inline-flex w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center text-xl mb-3 shadow-lg`}>
            {stat.icon}
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">
            <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </div>
          <div className="text-sm text-white/40 font-medium">{stat.label}</div>
          <div className="absolute right-4 top-4 opacity-5 text-6xl">{stat.icon}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Continue Learning ────────────────────────────────────────────────────────

function ContinueLearning() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-violet-400">▶</span> Continue Learning
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {/* Last studied */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0a2e] to-[#0d0d22] border border-violet-500/20 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1">📍 Pick up where you left off</div>
              <h3 className="text-xl font-bold text-white">Electrostatics</h3>
              <p className="text-sm text-white/50 mt-1">Physics · Chapter 14 · Coulomb's Law</p>
            </div>
            <div className="bg-violet-500/20 rounded-xl p-3 text-2xl">⚛️</div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>Chapter progress</span>
              <span className="text-violet-400 font-semibold">68%</span>
            </div>
            <ProgressBar value={68} color="from-violet-500 to-purple-400" height="h-2" />
          </div>
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl text-sm font-semibold text-white shadow-lg shadow-violet-500/30"
            >
              Continue →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              View Notes
            </motion.button>
          </div>
        </motion.div>

        {/* Quick actions column */}
        <div className="flex flex-col gap-4">
          {/* Next recommended */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 rounded-2xl bg-gradient-to-br from-[#0a1e1a] to-[#0d0d22] border border-emerald-500/20 p-4"
          >
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">Next up</div>
            <div className="text-base font-bold text-white">Organic Reactions</div>
            <div className="text-xs text-white/40 mb-3">Chemistry · Chapter 8</div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-2 bg-emerald-500/15 border border-emerald-500/25 rounded-lg text-sm font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
            >
              Start →
            </motion.button>
          </motion.div>

          {/* Quick Quiz */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl bg-gradient-to-br from-[#1a1206] to-[#0d0d22] border border-amber-500/20 p-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-xl">⚡</div>
              <div>
                <div className="text-sm font-bold text-white">Quick 5-min Quiz</div>
                <div className="text-xs text-white/40">Mixed · 10 questions</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full mt-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-sm font-bold text-white shadow-lg shadow-amber-500/25"
            >
              Start Quiz 🎯
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Subjects Grid ────────────────────────────────────────────────────────────

function SubjectsGrid() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-amber-400">📚</span> Your Subjects
        </h2>
        <motion.button
          whileHover={{ scale: 1.04 }}
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          View all →
        </motion.button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SUBJECTS.map((sub, idx) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * idx, type: 'spring', stiffness: 200, damping: 22 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl border border-white/5 p-5 cursor-pointer group shadow-xl ${sub.shadow}`}
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${sub.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${sub.gradient} opacity-5 rounded-full -translate-y-8 translate-x-8 blur-2xl`} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sub.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                  {sub.icon}
                </div>
                <span className="text-xs text-white/30 font-medium">
                  {sub.chaptersCompleted}/{sub.chaptersTotal} ch.
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-0.5">{sub.name}</h3>
              <p className="text-xs text-white/40 mb-3">Last: {sub.lastTopic}</p>

              <div className="mb-1.5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Progress</span>
                  <span className="text-white/70 font-semibold">{sub.progress}%</span>
                </div>
                <ProgressBar value={sub.progress} color={sub.gradient} height="h-1.5" />
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${sub.gradient} opacity-80 hover:opacity-100 transition-opacity shadow-lg`}
              >
                Continue →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Today's Schedule ─────────────────────────────────────────────────────────

function TodaySchedule() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-sky-400">📅</span> Today's Schedule
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {SCHEDULE.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-[#0d0d22] border border-white/5 p-5 cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5`} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-md`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.label}</div>
                  <div className="text-xs text-white/40">{item.subtitle}</div>
                </div>
              </div>
              {item.countdownSec > 0 && (
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xs text-white/40 mb-0.5">
                    {item.type === 'contest' ? 'Starts in' : 'Resets in'}
                  </div>
                  <CountdownTimer initialSec={item.countdownSec} />
                </div>
              )}
              {item.type === 'assignment' && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full py-2 mt-1 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${item.color} shadow-md`}
                >
                  Start Assignment
                </motion.button>
              )}
              {item.type === 'quiz' && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full py-2 mt-1 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${item.color} shadow-md`}
                >
                  Take Quiz →
                </motion.button>
              )}
              {item.type === 'contest' && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-2 mt-1 rounded-xl text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
                >
                  Set Reminder 🔔
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Knowledge Gap Radar ──────────────────────────────────────────────────────

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    const isWeak = d.A < 60;
    return (
      <div className="bg-[#12122a] border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-bold text-white">{d.subject}</p>
        <p className={`text-lg font-extrabold ${isWeak ? 'text-red-400' : 'text-emerald-400'}`}>{d.A}%</p>
        {isWeak && <p className="text-xs text-red-400/70">⚠ Needs attention</p>}
      </div>
    );
  }
  return null;
};

function KnowledgeGapRadar() {
  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-[#0d0d22] border border-white/5 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-red-400">🕸️</span> Knowledge Gap Radar
            </h2>
            <p className="text-sm text-white/40 mt-0.5">Areas below 60% highlighted as weak zones</p>
          </div>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-white/50">Your performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-white/50">Weak areas (&lt;60%)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                  axisLine={false}
                />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3">
            {RADAR_DATA.map((d) => {
              const isWeak = d.A < 60;
              return (
                <motion.div
                  key={d.subject}
                  whileHover={{ scale: 1.03 }}
                  className={`rounded-xl p-3 border ${isWeak ? 'bg-red-500/5 border-red-500/20' : 'bg-white/3 border-white/5'}`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-white">{d.subject}</span>
                    {isWeak && <span className="text-xs text-red-400">⚠ Weak</span>}
                  </div>
                  <ProgressBar
                    value={d.A}
                    color={isWeak ? 'from-red-500 to-red-400' : 'from-violet-500 to-purple-400'}
                    height="h-1.5"
                  />
                  <div className={`text-xs font-bold mt-1 ${isWeak ? 'text-red-400' : 'text-emerald-400'}`}>{d.A}%</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Phoenix Path ─────────────────────────────────────────────────────────────

function PhoenixPath() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to current level
    const el = scrollRef.current;
    if (!el) return;
    const currentEl = el.querySelector('[data-current="true"]') as HTMLElement;
    if (currentEl) {
      const elCenter = currentEl.offsetLeft - el.clientWidth / 2 + currentEl.clientWidth / 2;
      el.scrollTo({ left: elCenter, behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-[#0d0d22] border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400">🗺️</span> Phoenix Path
          </h2>
          <span className="text-xs text-white/40 font-medium">Level {USER.level} / 20</span>
        </div>

        <div
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10"
        >
          {PHOENIX_LEVELS.map((lvl, idx) => (
            <div key={lvl.level} className="flex items-center gap-4 shrink-0">
              {/* Connector */}
              {idx > 0 && (
                <div className={`w-8 h-0.5 rounded-full ${lvl.completed || lvl.current ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-white/10'}`} />
              )}

              <motion.div
                data-current={lvl.current}
                whileHover={{ scale: 1.1 }}
                className={`relative flex flex-col items-center gap-1.5 cursor-pointer ${lvl.current ? 'z-10' : ''}`}
              >
                {/* Node */}
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300
                  ${lvl.current
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/50 ring-4 ring-amber-400/30'
                    : lvl.completed
                    ? 'bg-gradient-to-br from-emerald-500/80 to-teal-500/80 shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 border border-white/10'
                  }`}
                >
                  {lvl.current ? '🦅' : lvl.completed ? '✓' : lvl.level}
                  {lvl.current && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-full bg-amber-400/40"
                    />
                  )}
                </div>

                {/* Label */}
                <div className="text-center">
                  <div className={`text-xs font-bold ${lvl.current ? 'text-amber-400' : lvl.completed ? 'text-emerald-400' : 'text-white/20'}`}>
                    Lv.{lvl.level}
                  </div>
                  <div className={`text-[10px] ${lvl.current ? 'text-white/60' : lvl.completed ? 'text-white/40' : 'text-white/15'}`}>
                    {lvl.label}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
          {[
            { color: 'bg-emerald-500', label: 'Completed' },
            { color: 'bg-gradient-to-r from-amber-400 to-orange-500', label: 'Current' },
            { color: 'bg-white/10', label: 'Upcoming' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${l.color}`} />
              <span className="text-xs text-white/40">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

function LeaderboardSnippet() {
  return (
    <section className="mb-8">
      <div className="rounded-2xl bg-[#0d0d22] border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400">🏆</span> Leaderboard
          </h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            Full board →
          </motion.button>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map((player, idx) => {
            const isUser = (player as any).isUser;
            const top3Colors = ['from-yellow-400 to-amber-500', 'from-slate-300 to-slate-400', 'from-amber-600 to-amber-700'];
            return (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * idx }}
                className={`flex items-center gap-4 rounded-xl p-3 transition-all ${
                  isUser
                    ? 'bg-violet-500/10 border border-violet-500/20'
                    : idx === 5
                    ? 'mt-4 border-t border-dashed border-white/10 pt-4'
                    : 'hover:bg-white/3'
                }`}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0
                  ${player.rank <= 3
                    ? `bg-gradient-to-br ${top3Colors[player.rank - 1]} text-white shadow-md`
                    : 'bg-white/5 text-white/40'
                  }`}>
                  {player.badge || `#${player.rank}`}
                </div>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${isUser ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
                  {player.name[0]}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${isUser ? 'text-violet-300' : 'text-white'}`}>
                    {player.name}
                  </div>
                </div>

                {/* XP */}
                <div className="text-right shrink-0">
                  <div className={`text-sm font-bold ${isUser ? 'text-violet-400' : player.rank <= 3 ? 'text-amber-400' : 'text-white/60'}`}>
                    {player.xp.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/30">XP</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── AI Recommendations ───────────────────────────────────────────────────────

function AIRecommendations() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-violet-400">🤖</span> AI Recommendations
          <span className="text-xs text-white/30 font-normal ml-1">Powered by Phoenix AI</span>
        </h2>
        <motion.button whileHover={{ scale: 1.04 }} className="text-sm text-white/40 hover:text-white/70 transition-colors">
          Refresh →
        </motion.button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {AI_RECOMMENDATIONS.map((rec, idx) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-[#0d0d22] border border-white/5 cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden h-44 bg-black">
              <img
                src={rec.thumbnail}
                alt={rec.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x220/1a1a3e/8b5cf6?text=${encodeURIComponent(rec.channel)}`;
                }}
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                {rec.duration}
              </div>
              {/* Tag */}
              <div className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur ${rec.tagColor}`}>
                {rec.tag}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-bold text-white leading-snug mb-1 line-clamp-2">{rec.title}</h3>
              <p className="text-xs text-white/40 mb-3">{rec.channel}</p>

              {/* AI reason */}
              <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <span className="text-violet-400 text-xs shrink-0 mt-0.5">🤖</span>
                  <p className="text-xs text-white/50 italic leading-relaxed">{rec.reason}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full mt-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white/70 hover:text-white transition-all"
              >
                Watch Now →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Page Wrapper (background + grid) ────────────────────────────────────────

function PageBackground() {
  return (
    <>
      {/* Deep dark cosmic bg */}
      <div className="fixed inset-0 bg-[#060612] -z-20" />
      {/* Subtle grid */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Ambient glow blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-700/8 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-700/8 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [notifOpen, setNotifOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans">
      <PageBackground />
      <Navbar notifOpen={notifOpen} setNotifOpen={setNotifOpen} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <HeroSection />
        <StatsRow />

        {/* Two-column layout for middle content */}
        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-0">
            <ContinueLearning />
            <SubjectsGrid />
            <TodaySchedule />
            <KnowledgeGapRadar />
            <PhoenixPath />
            <AIRecommendations />
          </div>
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-8">
            <LeaderboardSnippet />

            {/* Quick Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-[#0d0d22] border border-white/5 p-6"
            >
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">📈</span> This Week
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Study time', value: '14h 22m', icon: '⏱️' },
                  { label: 'Quizzes taken', value: '8', icon: '📝' },
                  { label: 'Topics covered', value: '12', icon: '📚' },
                  { label: 'XP earned', value: '+820', icon: '⚡' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span>{s.icon}</span>
                      {s.label}
                    </div>
                    <div className="text-sm font-bold text-white">{s.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Study Streak Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-[#0d0d22] border border-white/5 p-6"
            >
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <FlameIcon size={18} /> Streak Calendar
              </h3>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 28 }, (_, i) => {
                  const active = i < USER.streak && i < 28;
                  const today = i === USER.streak - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.01 * i, type: 'spring' }}
                      className={`w-full aspect-square rounded-md flex items-center justify-center text-xs
                        ${today
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/40'
                          : active
                          ? 'bg-orange-500/40'
                          : 'bg-white/5'
                        }`}
                    >
                      {today && <span className="text-xs">🔥</span>}
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-xs text-white/30 mt-3 text-center">Last 4 weeks · {USER.streak} day streak 🔥</p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8 py-6 text-center">
        <p className="text-xs text-white/20">
          PhoenixLearn © 2026 · Built for learners who dare to rise 🔥
        </p>
      </footer>
    </div>
  );
}
