'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Flame, Clock, BookOpen, BarChart3, ChevronRight,
  Star, Play, CalendarDays, RefreshCw, Zap, Target, TrendingUp,
  CheckCircle2, Lock, AlarmClock, ChevronDown,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────
const DAILY_QUIZ = {
  id: 'daily-2026-09-28',
  subject: 'Physics',
  chapter: 'Electrostatics',
  questionCount: 10,
  timeLimitMin: 12,
  xpReward: 150,
  completed: false,
  score: null as number | null,
  deadline: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 h from now
}

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology']
const CHAPTERS: Record<string, string[]> = {
  Physics: ['Mechanics', 'Electrostatics', 'Waves & Optics', 'Thermodynamics', 'Modern Physics'],
  Chemistry: ['Atomic Structure', 'Chemical Bonding', 'Equilibrium', 'Organic Reactions', 'Electrochemistry'],
  Mathematics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Probability'],
  Biology: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology'],
}

const MOCK_TESTS = [
  {
    id: 'mock-jee-main-1',
    title: 'JEE Main Mock #7',
    type: 'JEE Main',
    questions: 90,
    durationMin: 180,
    xp: 500,
    difficulty: 'Hard',
    attempted: true,
    score: 74,
    badge: '🎯',
  },
  {
    id: 'mock-jee-adv-1',
    title: 'JEE Advanced Full Paper',
    type: 'JEE Advanced',
    questions: 54,
    durationMin: 180,
    xp: 750,
    difficulty: 'JEE',
    attempted: false,
    score: null,
    badge: '🔥',
  },
  {
    id: 'mock-neet-1',
    title: 'NEET Mock Test #4',
    type: 'NEET',
    questions: 200,
    durationMin: 200,
    xp: 600,
    difficulty: 'Hard',
    attempted: true,
    score: 81,
    badge: '⚡',
  },
]

const RECENT_QUIZZES = [
  { id: 'q1', subject: 'Mathematics', chapter: 'Calculus', score: 90, total: 10, date: '27 Sep', xpEarned: 135 },
  { id: 'q2', subject: 'Physics', chapter: 'Mechanics', score: 70, total: 10, date: '26 Sep', xpEarned: 95 },
  { id: 'q3', subject: 'Chemistry', chapter: 'Organic Reactions', score: 60, total: 10, date: '25 Sep', xpEarned: 80 },
  { id: 'q4', subject: 'Mathematics', chapter: 'Algebra', score: 100, total: 10, date: '24 Sep', xpEarned: 150 },
  { id: 'q5', subject: 'Physics', chapter: 'Waves', score: 80, total: 10, date: '23 Sep', xpEarned: 115 },
]

const CHART_DATA = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 85 },
  { day: 'Wed', score: 78 },
  { day: 'Thu', score: 91 },
  { day: 'Fri', score: 88 },
  { day: 'Sat', score: 95 },
  { day: 'Sun', score: 82 },
]

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'JEE'] as const
type Diff = (typeof DIFFICULTIES)[number]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// Section heading
function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
        {icon}
      </div>
      <div>
        <h2 className="text-white font-bold text-lg">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
    </div>
  )
}

// Countdown display
function Countdown({ deadline }: { deadline: Date }) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    function tick() {
      const diff = deadline.getTime() - Date.now()
      if (diff <= 0) { setRemaining('Expired'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(`${h}h ${m}m ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline])

  return <span className="text-orange-400 font-mono font-bold">{remaining}</span>
}

// Daily Quiz Card
function DailyQuizCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-500/15 via-orange-400/5 to-transparent p-6"
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-400/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase tracking-widest">
              Today's Quiz
            </span>
            {DAILY_QUIZ.completed && (
              <span className="px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                ✓ Done
              </span>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">{DAILY_QUIZ.subject}</h3>
            <p className="text-gray-400 text-sm mt-1">{DAILY_QUIZ.chapter}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-400" />
              {DAILY_QUIZ.questionCount} questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              {DAILY_QUIZ.timeLimitMin} min
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-400" />
              +{DAILY_QUIZ.xpReward} XP
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AlarmClock className="w-4 h-4" />
            Resets in <Countdown deadline={DAILY_QUIZ.deadline} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          {DAILY_QUIZ.completed ? (
            <>
              <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-400">{DAILY_QUIZ.score}%</span>
              </div>
              <Link
                href={`/quiz/${DAILY_QUIZ.id}`}
                className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-gray-300 hover:bg-white/15 transition-colors"
              >
                Review
              </Link>
            </>
          ) : (
            <Link
              href={`/quiz/${DAILY_QUIZ.id}`}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              <Play className="w-5 h-5" />
              Start Quiz
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Topic Quiz selector
function TopicQuizSection() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* Subject pills */}
      <div>
        <p className="text-gray-400 text-sm mb-3">Select Subject</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => { setSelectedSubject(s === selectedSubject ? null : s); setSelectedChapter(null) }}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                selectedSubject === s
                  ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                  : 'bg-white/5 border-white/15 text-gray-300 hover:border-orange-400/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter pills */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-gray-400 text-sm mb-3">Select Chapter</p>
            <div className="flex flex-wrap gap-2">
              {CHAPTERS[selectedSubject]?.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch === selectedChapter ? null : ch)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                    selectedChapter === ch
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-white/5 border-white/15 text-gray-400 hover:border-amber-400/40'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start button */}
      <AnimatePresence>
        {selectedSubject && selectedChapter && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Link
              href={`/quiz/topic-${selectedSubject.toLowerCase()}-${selectedChapter.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              <Play className="w-4 h-4" />
              Start: {selectedChapter}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mock Test card
function MockTestCard({ test }: { test: (typeof MOCK_TESTS)[0] }) {
  const diffColors: Record<string, string> = {
    Hard: 'text-orange-400 bg-orange-400/15 border-orange-400/30',
    JEE: 'text-red-400 bg-red-400/15 border-red-400/30',
    Medium: 'text-yellow-400 bg-yellow-400/15 border-yellow-400/30',
  }

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(251,146,60,0.12)' }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{test.badge}</span>
            <span className="px-2 py-0.5 rounded-full border text-xs font-bold ${diffColors[test.difficulty]}">
              {test.type}
            </span>
          </div>
          <h4 className="text-white font-bold text-base">{test.title}</h4>
        </div>
        {test.attempted && test.score !== null && (
          <div className={`text-lg font-bold ${test.score >= 80 ? 'text-emerald-400' : test.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {test.score}%
          </div>
        )}
      </div>

      <div className="flex gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{test.questions} Qs</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{test.durationMin} min</span>
        <span className="flex items-center gap-1 text-orange-400"><Zap className="w-3.5 h-3.5" />+{test.xp} XP</span>
      </div>

      <Link
        href={`/quiz/${test.id}`}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          test.attempted
            ? 'bg-white/10 border border-white/15 text-gray-300 hover:bg-white/15'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35'
        }`}
      >
        {test.attempted ? <><RefreshCw className="w-4 h-4" /> Retake</> : <><Play className="w-4 h-4" /> Start</>}
      </Link>
    </motion.div>
  )
}

// Practice mode section
function PracticeSection() {
  const [diff, setDiff] = useState<Diff>('Medium')

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-purple-400" />
        <div>
          <h3 className="text-white font-bold">Infinite Practice</h3>
          <p className="text-gray-400 text-xs">Endless questions — improve at your pace</p>
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-3">Difficulty</p>
        <div className="flex gap-2 flex-wrap">
          {DIFFICULTIES.map((d) => {
            const colors: Record<Diff, string> = {
              Easy: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
              Medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
              Hard: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
              JEE: 'bg-red-500/20 border-red-500/50 text-red-300',
            }
            return (
              <button
                key={d}
                onClick={() => setDiff(d)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                  diff === d ? colors[d] : 'bg-white/5 border-white/15 text-gray-500 hover:border-white/30'
                }`}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>

      <Link
        href={`/quiz/practice?difficulty=${diff}`}
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
      >
        <Play className="w-4 h-4" />
        Start {diff} Practice
      </Link>
    </div>
  )
}

// Score bar chart
function ScoreChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold">Week Performance</h3>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          +8% vs last week
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={CHART_DATA} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
            labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
            itemStyle={{ color: '#FB923C' }}
            formatter={(v: number) => [`${v}%`, 'Score']}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {CHART_DATA.map((entry, i) => (
              <Cell key={i} fill={entry.score >= 90 ? '#10B981' : entry.score >= 75 ? '#FB923C' : '#6B7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Recent history row
function HistoryRow({ q }: { q: (typeof RECENT_QUIZZES)[0] }) {
  const pct = Math.round((q.score / q.total) * 100)
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{q.chapter}</p>
        <p className="text-xs text-gray-500">{q.subject} · {q.date}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-sm font-bold w-10 text-right ${pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
          {pct}%
        </span>
        <span className="text-xs text-orange-400 flex items-center gap-0.5 w-16 justify-end">
          <Zap className="w-3 h-3" />+{q.xpEarned}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const completedToday = DAILY_QUIZ.completed
  const avgScore = Math.round(CHART_DATA.reduce((a, c) => a + c.score, 0) / CHART_DATA.length)

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-black text-white">
              Quiz{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Zone
              </span>
            </h1>
            <p className="text-gray-400 mt-1">Test your knowledge, earn XP, climb the ranks</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Daily status pill */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${
              completedToday
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-orange-500/15 border-orange-500/40 text-orange-400'
            }`}>
              {completedToday ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {completedToday ? 'Daily Done!' : 'Daily Pending'}
            </div>

            {/* Avg score */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
              <Star className="w-4 h-4 text-yellow-400" />
              Avg: <span className="text-white font-bold">{avgScore}%</span>
            </div>
          </div>
        </motion.div>

        {/* ── Daily Quiz ── */}
        <section>
          <SectionHeading
            icon={<CalendarDays className="w-5 h-5" />}
            title="Daily Quiz"
            subtitle="Complete every day to maintain your streak"
          />
          <DailyQuizCard />
        </section>

        {/* ── Topic Quiz ── */}
        <section>
          <SectionHeading
            icon={<BookOpen className="w-5 h-5" />}
            title="Topic Quiz"
            subtitle="Pick any subject and chapter"
          />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <TopicQuizSection />
          </div>
        </section>

        {/* ── Mock Tests ── */}
        <section>
          <SectionHeading
            icon={<Trophy className="w-5 h-5" />}
            title="Mock Tests"
            subtitle="Full-length exam simulations"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_TESTS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <MockTestCard test={t} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Practice + Chart ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SectionHeading icon={<Target className="w-5 h-5" />} title="Practice Mode" />
            <PracticeSection />
          </div>
          <div>
            <SectionHeading icon={<BarChart3 className="w-5 h-5" />} title="Score Trend" />
            <ScoreChart />
          </div>
        </section>

        {/* ── Recent History ── */}
        <section>
          <SectionHeading
            icon={<RefreshCw className="w-5 h-5" />}
            title="Recent Quizzes"
            subtitle="Your last 5 attempts"
          />
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2">
            {RECENT_QUIZZES.map((q) => (
              <HistoryRow key={q.id} q={q} />
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
