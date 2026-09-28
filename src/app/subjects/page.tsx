'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SubjectCard, { Subject } from '@/components/subject/SubjectCard'

// ─── Data ────────────────────────────────────────────────────────────────────

export const ALL_SUBJECTS: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    emoji: '🔢',
    description: 'Algebra, Calculus, Trigonometry, Statistics and more.',
    color: '#6366f1',
    gradient: 'from-indigo-600 via-violet-600 to-purple-700',
    glowColor: 'rgba(99,102,241,0.5)',
    totalChapters: 18,
    totalXP: 9000,
  },
  {
    id: 'physics',
    name: 'Physics',
    emoji: '⚛️',
    description: 'Mechanics, Electromagnetism, Optics, Modern Physics.',
    color: '#0ea5e9',
    gradient: 'from-sky-500 via-cyan-500 to-teal-600',
    glowColor: 'rgba(14,165,233,0.5)',
    totalChapters: 16,
    totalXP: 8000,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    emoji: '🧪',
    description: 'Organic, Inorganic, Physical Chemistry concepts.',
    color: '#10b981',
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glowColor: 'rgba(16,185,129,0.5)',
    totalChapters: 20,
    totalXP: 10000,
  },
  {
    id: 'biology',
    name: 'Biology',
    emoji: '🧬',
    description: 'Cell biology, Genetics, Ecology, Human Physiology.',
    color: '#f59e0b',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    glowColor: 'rgba(245,158,11,0.5)',
    totalChapters: 22,
    totalXP: 11000,
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    emoji: '💻',
    description: 'Data Structures, Algorithms, Networking, Databases.',
    color: '#8b5cf6',
    gradient: 'from-violet-600 via-purple-600 to-pink-600',
    glowColor: 'rgba(139,92,246,0.5)',
    totalChapters: 14,
    totalXP: 7000,
  },
  {
    id: 'history',
    name: 'History',
    emoji: '🏛️',
    description: 'Ancient civilizations, World Wars, Modern History.',
    color: '#b45309',
    gradient: 'from-yellow-700 via-amber-600 to-orange-600',
    glowColor: 'rgba(180,83,9,0.5)',
    totalChapters: 12,
    totalXP: 6000,
  },
]

const ENROLLED_SUBJECTS = ['mathematics', 'physics', 'chemistry']

const PROGRESS_MAP: Record<string, number> = {
  mathematics: 64,
  physics: 30,
  chemistry: 12,
}

const CHAPTERS_COMPLETED: Record<string, number> = {
  mathematics: 11,
  physics: 5,
  chemistry: 2,
}

type FilterTab = 'all' | 'enrolled' | 'available'

// ─── Marvel Intro Overlay ─────────────────────────────────────────────────────

function MarvelIntroOverlay({
  subject,
  onComplete,
}: {
  subject: Subject
  onComplete: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Brick cells burst effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${subject.gradient}`}
      />

      {/* Grid of cells that flip away */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
        {Array.from({ length: 48 }).map((_, i) => {
          const delay = (i % 8) * 0.03 + Math.floor(i / 8) * 0.05
          return (
            <motion.div
              key={i}
              className="bg-[#0a0a0f] border border-gray-900/40"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.35, delay, ease: 'easeIn' }}
            />
          )
        })}
      </div>

      {/* Subject logo burst */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [0, 1.3, 1], rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.div
          className="text-8xl"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {subject.emoji}
        </motion.div>
        <motion.h1
          className="text-white text-4xl font-black tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {subject.name}
        </motion.h1>
        <motion.div
          className="h-1 bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 160 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />
        <motion.p
          className="text-white/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Launching your learning experience...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubjectsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterTab>('all')
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(
    new Set(ENROLLED_SUBJECTS)
  )
  const [introSubject, setIntroSubject] = useState<Subject | null>(null)
  const [pendingNav, setPendingNav] = useState<string | null>(null)

  const filteredSubjects = ALL_SUBJECTS.filter((s) => {
    if (filter === 'enrolled') return enrolledIds.has(s.id)
    if (filter === 'available') return !enrolledIds.has(s.id)
    return true
  })

  const enrolledSubjects = ALL_SUBJECTS.filter((s) => enrolledIds.has(s.id))
  const availableSubjects = ALL_SUBJECTS.filter((s) => !enrolledIds.has(s.id))

  function handleContinue(subject: Subject) {
    setIntroSubject(subject)
    setPendingNav(`/subjects/${subject.id}`)
  }

  function handleIntroComplete() {
    const nav = pendingNav
    setIntroSubject(null)
    setPendingNav(null)
    if (nav) router.push(nav)
  }

  function handleEnroll(subject: Subject) {
    setEnrolledIds((prev) => new Set([...prev, subject.id]))
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <AnimatePresence>
        {introSubject && (
          <MarvelIntroOverlay subject={introSubject} onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link href="/dashboard" className="text-white/40 hover:text-white/70 transition-colors">
                Dashboard
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-white font-medium">Subjects</span>
            </div>

            {/* Right: filter tabs */}
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              {(['all', 'enrolled', 'available'] as FilterTab[]).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    filter === tab
                      ? 'bg-white text-gray-900'
                      : 'text-white/50 hover:text-white'
                  }`}
                  whileTap={{ scale: 0.96 }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black mb-2">
            Your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Learning Universe
            </span>
          </h1>
          <p className="text-white/50 text-base">
            {enrolledIds.size} subjects enrolled · Keep the streak alive 🔥
          </p>
        </motion.div>

        {/* ── Your Subjects ── */}
        {(filter === 'all' || filter === 'enrolled') && enrolledSubjects.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white/80">📚 Your Subjects</h2>
              <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Change Subjects
              </button>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {(filter === 'all' ? enrolledSubjects : filteredSubjects.filter(s => enrolledIds.has(s.id))).map((subject) => (
                <motion.div key={subject.id} variants={itemVariants}>
                  <SubjectCard
                    subject={subject}
                    progress={PROGRESS_MAP[subject.id] ?? 0}
                    chaptersCompleted={CHAPTERS_COMPLETED[subject.id] ?? 0}
                    enrolled={true}
                    onContinue={handleContinue}
                    onEnroll={handleEnroll}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ── Explore More ── */}
        {(filter === 'all' || filter === 'available') && availableSubjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white/80">🌐 Explore More</h2>
              <span className="text-xs text-white/30">{availableSubjects.length} subjects available</span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {(filter === 'all' ? availableSubjects : filteredSubjects.filter(s => !enrolledIds.has(s.id))).map((subject) => (
                <motion.div key={subject.id} variants={itemVariants}>
                  <SubjectCard
                    subject={subject}
                    enrolled={false}
                    onContinue={handleContinue}
                    onEnroll={handleEnroll}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Empty state */}
        {filteredSubjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Nothing here yet</h3>
            <p className="text-white/40 text-sm">Try switching to a different filter tab.</p>
          </motion.div>
        )}

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Subjects Enrolled', value: enrolledIds.size, icon: '📚' },
            {
              label: 'Total XP Earned',
              value: `${Object.entries(PROGRESS_MAP)
                .reduce((acc, [id, p]) => {
                  const sub = ALL_SUBJECTS.find((s) => s.id === id)
                  return acc + Math.floor((p / 100) * (sub?.totalXP ?? 0))
                }, 0)
                .toLocaleString()} XP`,
              icon: '⚡',
            },
            {
              label: 'Chapters Done',
              value: Object.values(CHAPTERS_COMPLETED).reduce((a, b) => a + b, 0),
              icon: '✅',
            },
            { label: 'Day Streak', value: '12 🔥', icon: '🗓️' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
