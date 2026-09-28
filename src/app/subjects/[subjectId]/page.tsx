'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Topic {
  id: string
  name: string
  completed: boolean
}

interface Chapter {
  id: string
  number: number
  name: string
  topics: Topic[]
  completionPct: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  locked: boolean
}

interface NoteCard {
  id: string
  title: string
  pages: number
  size: string
  hasViewer3D: boolean
}

interface FlashcardSet {
  id: string
  chapterName: string
  cardCount: number
  mastered: number
}

interface Simulation {
  id: string
  name: string
  description: string
  emoji: string
  status: 'available' | 'coming-soon'
}

interface Video {
  id: string
  title: string
  channel: string
  duration: string
  thumbnail: string
  url: string
}

interface SubjectData {
  id: string
  name: string
  emoji: string
  description: string
  gradient: string
  glowColor: string
  level: number
  xpEarned: number
  xpTotal: number
  chaptersCompleted: number
  totalChapters: number
  progress: number
  chapters: Chapter[]
  notes: NoteCard[]
  flashcardSets: FlashcardSet[]
  simulations: Simulation[]
  videos: Video[]
  weakTopics: string[]
}

// ─── Subject Data ─────────────────────────────────────────────────────────────

const SUBJECTS_DATA: Record<string, SubjectData> = {
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    emoji: '🔢',
    description:
      'Master the language of the universe — from quadratic equations to multivariable calculus.',
    gradient: 'from-indigo-600 via-violet-600 to-purple-700',
    glowColor: 'rgba(99,102,241,0.4)',
    level: 7,
    xpEarned: 5760,
    xpTotal: 9000,
    chaptersCompleted: 11,
    totalChapters: 18,
    progress: 64,
    weakTopics: ['Integration by Parts', 'Bayes Theorem', 'Complex Numbers'],
    chapters: [
      {
        id: 'ch1',
        number: 1,
        name: 'Algebra Fundamentals',
        completionPct: 100,
        difficulty: 'Easy',
        locked: false,
        topics: [
          { id: 't1', name: 'Sets and Relations', completed: true },
          { id: 't2', name: 'Functions', completed: true },
          { id: 't3', name: 'Inequalities', completed: true },
        ],
      },
      {
        id: 'ch2',
        number: 2,
        name: 'Quadratic Equations',
        completionPct: 80,
        difficulty: 'Easy',
        locked: false,
        topics: [
          { id: 't4', name: 'Solving Quadratics', completed: true },
          { id: 't5', name: 'Discriminant Analysis', completed: true },
          { id: 't6', name: 'Nature of Roots', completed: false },
          { id: 't7', name: 'Word Problems', completed: false },
        ],
      },
      {
        id: 'ch3',
        number: 3,
        name: 'Trigonometry',
        completionPct: 60,
        difficulty: 'Medium',
        locked: false,
        topics: [
          { id: 't8', name: 'Trigonometric Ratios', completed: true },
          { id: 't9', name: 'Identities', completed: true },
          { id: 't10', name: 'Inverse Trig', completed: false },
          { id: 't11', name: 'Heights & Distances', completed: false },
        ],
      },
      {
        id: 'ch4',
        number: 4,
        name: 'Calculus — Limits',
        completionPct: 0,
        difficulty: 'Hard',
        locked: false,
        topics: [
          { id: 't12', name: 'Concept of Limits', completed: false },
          { id: 't13', name: "L'Hôpital's Rule", completed: false },
          { id: 't14', name: 'Continuity', completed: false },
        ],
      },
      {
        id: 'ch5',
        number: 5,
        name: 'Calculus — Derivatives',
        completionPct: 0,
        difficulty: 'Hard',
        locked: true,
        topics: [
          { id: 't15', name: 'First Principle', completed: false },
          { id: 't16', name: 'Chain Rule', completed: false },
          { id: 't17', name: 'Applications', completed: false },
        ],
      },
    ],
    notes: [
      { id: 'n1', title: 'Algebra Fundamentals Notes', pages: 24, size: '2.3 MB', hasViewer3D: true },
      { id: 'n2', title: 'Quadratic Equations Cheatsheet', pages: 8, size: '1.1 MB', hasViewer3D: false },
      { id: 'n3', title: 'Trigonometry Full Notes', pages: 38, size: '4.7 MB', hasViewer3D: true },
      { id: 'n4', title: 'Calculus Reference Card', pages: 12, size: '1.8 MB', hasViewer3D: false },
    ],
    flashcardSets: [
      { id: 'fs1', chapterName: 'Algebra Fundamentals', cardCount: 32, mastered: 32 },
      { id: 'fs2', chapterName: 'Quadratic Equations', cardCount: 28, mastered: 21 },
      { id: 'fs3', chapterName: 'Trigonometry', cardCount: 40, mastered: 18 },
      { id: 'fs4', chapterName: 'Calculus Limits', cardCount: 22, mastered: 0 },
    ],
    simulations: [
      { id: 'sim1', name: 'Graph Plotter', description: 'Plot any function live on a coordinate plane.', emoji: '📈', status: 'available' },
      { id: 'sim2', name: 'Matrix Visualizer', description: 'Visualize matrix transformations in 2D/3D.', emoji: '🧮', status: 'available' },
      { id: 'sim3', name: 'Derivative Playground', description: 'See derivatives geometrically.', emoji: '📐', status: 'coming-soon' },
    ],
    videos: [
      { id: 'v1', title: 'Quadratic Equations — Full Concept', channel: '3Blue1Brown', duration: '18:42', thumbnail: 'https://i.ytimg.com/vi/IlNAJl36-10/mqdefault.jpg', url: 'https://youtube.com' },
      { id: 'v2', title: 'Trigonometry Made Easy', channel: 'Khan Academy', duration: '24:10', thumbnail: 'https://i.ytimg.com/vi/Jsiy4TxgIME/mqdefault.jpg', url: 'https://youtube.com' },
      { id: 'v3', title: 'Introduction to Calculus', channel: 'Professor Leonard', duration: '41:08', thumbnail: 'https://i.ytimg.com/vi/WUvTyaaNkzM/mqdefault.jpg', url: 'https://youtube.com' },
    ],
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    emoji: '⚛️',
    description: 'Understand the fundamental forces that govern the cosmos.',
    gradient: 'from-sky-500 via-cyan-500 to-teal-600',
    glowColor: 'rgba(14,165,233,0.4)',
    level: 4,
    xpEarned: 2400,
    xpTotal: 8000,
    chaptersCompleted: 5,
    totalChapters: 16,
    progress: 30,
    weakTopics: ['Rotational Motion', 'Magnetic Effects', 'Wave Optics'],
    chapters: [
      {
        id: 'ph1',
        number: 1,
        name: 'Kinematics',
        completionPct: 100,
        difficulty: 'Easy',
        locked: false,
        topics: [
          { id: 'pt1', name: 'Motion in 1D', completed: true },
          { id: 'pt2', name: 'Projectile Motion', completed: true },
          { id: 'pt3', name: 'Relative Motion', completed: true },
        ],
      },
      {
        id: 'ph2',
        number: 2,
        name: "Newton's Laws",
        completionPct: 75,
        difficulty: 'Medium',
        locked: false,
        topics: [
          { id: 'pt4', name: 'First Law', completed: true },
          { id: 'pt5', name: 'Second Law', completed: true },
          { id: 'pt6', name: 'Third Law', completed: true },
          { id: 'pt7', name: 'Friction', completed: false },
        ],
      },
      {
        id: 'ph3',
        number: 3,
        name: 'Rotational Motion',
        completionPct: 0,
        difficulty: 'Hard',
        locked: false,
        topics: [
          { id: 'pt8', name: 'Torque', completed: false },
          { id: 'pt9', name: 'Moment of Inertia', completed: false },
          { id: 'pt10', name: 'Angular Momentum', completed: false },
        ],
      },
    ],
    notes: [
      { id: 'pn1', title: 'Kinematics Complete Notes', pages: 30, size: '3.2 MB', hasViewer3D: true },
      { id: 'pn2', title: "Newton's Laws Summary", pages: 16, size: '1.9 MB', hasViewer3D: false },
    ],
    flashcardSets: [
      { id: 'pfs1', chapterName: 'Kinematics', cardCount: 25, mastered: 25 },
      { id: 'pfs2', chapterName: "Newton's Laws", cardCount: 30, mastered: 18 },
    ],
    simulations: [
      { id: 'psim1', name: 'Projectile Simulator', description: 'Launch objects and trace their paths.', emoji: '🏹', status: 'available' },
      { id: 'psim2', name: 'Force Diagram Builder', description: 'Draw and analyze free body diagrams.', emoji: '⚖️', status: 'available' },
    ],
    videos: [
      { id: 'pv1', title: 'Kinematics in One Dimension', channel: 'Physics Wallah', duration: '32:17', thumbnail: 'https://i.ytimg.com/vi/2lVDktWK-pc/mqdefault.jpg', url: 'https://youtube.com' },
      { id: 'pv2', title: "Newton's Laws Explained", channel: 'Veritasium', duration: '14:55', thumbnail: 'https://i.ytimg.com/vi/XFhntPxow0U/mqdefault.jpg', url: 'https://youtube.com' },
    ],
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    emoji: '🧪',
    description: 'Dive into the molecular world — reactions, bonds, and the periodic table.',
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glowColor: 'rgba(16,185,129,0.4)',
    level: 2,
    xpEarned: 1200,
    xpTotal: 10000,
    chaptersCompleted: 2,
    totalChapters: 20,
    progress: 12,
    weakTopics: ['Electrochemistry', 'Coordination Compounds', 'Named Reactions'],
    chapters: [
      {
        id: 'cch1',
        number: 1,
        name: 'Atomic Structure',
        completionPct: 100,
        difficulty: 'Easy',
        locked: false,
        topics: [
          { id: 'ct1', name: 'Bohr Model', completed: true },
          { id: 'ct2', name: 'Quantum Numbers', completed: true },
          { id: 'ct3', name: 'Electronic Configuration', completed: true },
        ],
      },
      {
        id: 'cch2',
        number: 2,
        name: 'Periodic Table',
        completionPct: 50,
        difficulty: 'Easy',
        locked: false,
        topics: [
          { id: 'ct4', name: 'Periods & Groups', completed: true },
          { id: 'ct5', name: 'Ionization Energy', completed: false },
          { id: 'ct6', name: 'Electronegativity Trends', completed: false },
        ],
      },
      {
        id: 'cch3',
        number: 3,
        name: 'Chemical Bonding',
        completionPct: 0,
        difficulty: 'Medium',
        locked: false,
        topics: [
          { id: 'ct7', name: 'Ionic Bonds', completed: false },
          { id: 'ct8', name: 'Covalent Bonds', completed: false },
          { id: 'ct9', name: 'Hybridisation', completed: false },
        ],
      },
    ],
    notes: [
      { id: 'cn1', title: 'Atomic Structure Notes', pages: 20, size: '2.1 MB', hasViewer3D: false },
    ],
    flashcardSets: [
      { id: 'cfs1', chapterName: 'Atomic Structure', cardCount: 28, mastered: 28 },
    ],
    simulations: [
      { id: 'csim1', name: 'Molecular 3D Viewer', description: 'Visualize molecular geometry in 3D.', emoji: '🔬', status: 'available' },
    ],
    videos: [
      { id: 'cv1', title: 'Atomic Structure — Full Chapter', channel: 'JEE Wallah', duration: '45:20', thumbnail: 'https://i.ytimg.com/vi/4ypwHm7QIIA/mqdefault.jpg', url: 'https://youtube.com' },
    ],
  },
}

// Fallback for unknown subjects
function getSubjectData(id: string): SubjectData {
  return (
    SUBJECTS_DATA[id] ?? {
      ...SUBJECTS_DATA.mathematics,
      id,
      name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }
  )
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: 'Easy' | 'Medium' | 'Hard' }) {
  const colors = {
    Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${colors[level]}`}>
      {level}
    </span>
  )
}

// ─── Marvel Intro ─────────────────────────────────────────────────────────────

function MarvelIntroOverlay({
  subject,
  onComplete,
}: {
  subject: SubjectData
  onComplete: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2200)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient}`} />

      {/* Brick reveal grid */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-7">
        {Array.from({ length: 70 }).map((_, i) => {
          const col = i % 10
          const delay = col * 0.04 + Math.floor(i / 10) * 0.06
          return (
            <motion.div
              key={i}
              className="bg-[#0a0a0f]"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.3, delay, ease: 'easeIn' }}
            />
          )
        })}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-5"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <motion.div
          className="text-9xl"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {subject.emoji}
        </motion.div>
        <motion.h1
          className="text-white text-5xl font-black tracking-tight text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {subject.name}
        </motion.h1>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-white/60 text-sm">Level {subject.level}</span>
          <span className="text-white/40">·</span>
          <span className="text-white/60 text-sm">{subject.xpEarned.toLocaleString()} XP</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Chapters Tab ─────────────────────────────────────────────────────────────

function ChaptersTab({ chapters, subjectId }: { chapters: Chapter[]; subjectId: string }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div className="space-y-3">
      {chapters.map((ch, idx) => (
        <motion.div
          key={ch.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.07 }}
          className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
            ch.locked
              ? 'border-white/5 bg-white/3 opacity-60'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
        >
          {/* Chapter header */}
          <button
            onClick={() => !ch.locked && setExpanded(expanded === ch.id ? null : ch.id)}
            className="w-full flex items-center gap-4 p-5 text-left"
            disabled={ch.locked}
          >
            {/* Chapter number */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                ch.completionPct === 100
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : ch.completionPct > 0
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              {ch.completionPct === 100 ? '✓' : ch.number}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm text-white">{ch.name}</span>
                <DifficultyBadge level={ch.difficulty} />
                {ch.locked && (
                  <span className="text-[10px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded-full">
                    🔒 Locked
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>{ch.topics.length} topics</span>
                <span>·</span>
                <span>{ch.completionPct}% complete</span>
              </div>
            </div>

            {/* Progress bar + expand icon */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-24 bg-white/10 rounded-full h-1.5 hidden sm:block">
                <motion.div
                  className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${ch.completionPct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              {!ch.locked && (
                <motion.span
                  animate={{ rotate: expanded === ch.id ? 180 : 0 }}
                  className="text-white/30 text-xs"
                >
                  ▼
                </motion.span>
              )}
            </div>
          </button>

          {/* Expanded topic list */}
          <AnimatePresence>
            {expanded === ch.id && !ch.locked && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <div className="space-y-2 mb-4">
                    {ch.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center gap-3 text-sm group/topic"
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            topic.completed
                              ? 'border-emerald-500 bg-emerald-500/20'
                              : 'border-white/20 bg-transparent'
                          }`}
                        >
                          {topic.completed && (
                            <span className="text-emerald-400 text-[10px] font-bold">✓</span>
                          )}
                        </div>
                        <span
                          className={`flex-1 ${
                            topic.completed ? 'text-white/60 line-through' : 'text-white/80'
                          }`}
                        >
                          {topic.name}
                        </span>
                        {!topic.completed && (
                          <motion.button
                            onClick={() => router.push(`/learn/${topic.id}`)}
                            className="opacity-0 group-hover/topic:opacity-100 text-xs text-violet-400 hover:text-violet-300 transition-all"
                            whileTap={{ scale: 0.95 }}
                          >
                            Study →
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => {
                      const firstIncomplete = ch.topics.find((t) => !t.completed)
                      if (firstIncomplete) router.push(`/learn/${firstIncomplete.id}`)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    {ch.completionPct === 0 ? '🚀 Start Chapter' : '▶ Continue Chapter'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────

function NotesTab({ notes }: { notes: NoteCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {notes.map((note, i) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-14 bg-gradient-to-b from-red-500 to-red-700 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
              PDF
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white mb-1">{note.title}</h4>
              <p className="text-xs text-white/40">
                {note.pages} pages · {note.size}
              </p>
              <div className="flex gap-2 mt-3">
                <button className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg transition-all">
                  📄 View PDF
                </button>
                {note.hasViewer3D && (
                  <button className="text-xs px-3 py-1 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg transition-all border border-violet-500/30">
                    🔮 3D Viewer
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Flashcards Tab ───────────────────────────────────────────────────────────

function FlashcardsTab({ sets }: { sets: FlashcardSet[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sets.map((set, i) => {
        const mastery = Math.round((set.mastered / set.cardCount) * 100)
        return (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">{set.chapterName}</h4>
              <span className="text-xs text-white/40">{set.cardCount} cards</span>
            </div>

            {/* Mastery bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>Mastery</span>
                <span>{mastery}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <motion.div
                  className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${mastery}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 rounded-xl transition-all font-medium">
                🃏 Study
              </button>
              <button className="flex-1 py-2 text-xs bg-white/5 hover:bg-white/10 text-white/50 rounded-xl transition-all">
                Quiz Me
              </button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Simulations Tab ──────────────────────────────────────────────────────────

function SimulationsTab({ simulations }: { simulations: Simulation[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {simulations.map((sim, i) => (
        <motion.div
          key={sim.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`relative bg-white/5 border rounded-2xl p-5 transition-all ${
            sim.status === 'available'
              ? 'border-white/10 hover:border-white/20 cursor-pointer'
              : 'border-white/5 opacity-60'
          }`}
        >
          {sim.status === 'coming-soon' && (
            <span className="absolute top-3 right-3 text-[10px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          )}
          <div className="text-3xl mb-3">{sim.emoji}</div>
          <h4 className="text-sm font-semibold text-white mb-1">{sim.name}</h4>
          <p className="text-xs text-white/40 mb-4">{sim.description}</p>
          {sim.status === 'available' && (
            <button className="text-xs px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 rounded-xl transition-all font-medium">
              ▶ Launch
            </button>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Videos Tab ──────────────────────────────────────────────────────────────

function VideosTab({ videos }: { videos: Video[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-white/30 mb-2">🤖 AI-recommended videos based on your progress</p>
      {videos.map((v, i) => (
        <motion.a
          key={v.id}
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group"
        >
          {/* Thumbnail */}
          <div className="relative w-24 h-14 rounded-xl overflow-hidden shrink-0 bg-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs ml-0.5">▶</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors line-clamp-1">
              {v.title}
            </h4>
            <p className="text-xs text-white/40 mt-0.5">
              {v.channel} · {v.duration}
            </p>
          </div>
          <span className="text-white/20 group-hover:text-white/60 text-sm transition-colors shrink-0">
            →
          </span>
        </motion.a>
      ))}
    </div>
  )
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────

function RightSidebar({ subject }: { subject: SubjectData }) {
  return (
    <aside className="space-y-4">
      {/* AI Copilot Quick Access */}
      <div className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-violet-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-semibold text-white">AI Copilot</span>
        </div>
        <p className="text-xs text-white/50 mb-3">
          Ask anything about {subject.name}
        </p>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-violet-500/50"
            placeholder="Ask a question..."
          />
          <button className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-medium transition-all">
            →
          </button>
        </div>
      </div>

      {/* Weak Topics */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚠️</span>
          <span className="text-sm font-semibold text-white">Weak Topics</span>
        </div>
        <div className="space-y-2">
          {subject.weakTopics.map((topic) => (
            <div
              key={topic}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white/80 cursor-pointer transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Practice */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎯</span>
          <span className="text-sm font-semibold text-white">Suggested Practice</span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Daily Quiz', icon: '📝', sub: '10 questions' },
            { label: 'Mock Test', icon: '🏆', sub: '30 min · 25 Qs' },
            { label: 'Flashcard Review', icon: '🃏', sub: '15 cards due' },
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all"
            >
              <span className="text-base">{item.icon}</span>
              <div>
                <div className="text-xs font-medium text-white">{item.label}</div>
                <div className="text-[10px] text-white/40">{item.sub}</div>
              </div>
              <span className="ml-auto text-white/20 text-xs">→</span>
            </motion.button>
          ))}
        </div>
      </div>
    </aside>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'chapters' | 'notes' | 'flashcards' | 'simulations' | 'videos'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'chapters', label: 'Chapters', emoji: '📚' },
  { id: 'notes', label: 'Notes', emoji: '📄' },
  { id: 'flashcards', label: 'Flashcards', emoji: '🃏' },
  { id: 'simulations', label: 'Simulations', emoji: '🔬' },
  { id: 'videos', label: 'Videos', emoji: '▶️' },
]

export default function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = use(params)
  const subject = getSubjectData(subjectId)
  const [tab, setTab] = useState<Tab>('chapters')
  const [showIntro, setShowIntro] = useState(true)

  // Check if first visit via sessionStorage
  useEffect(() => {
    const key = `phoenix_visited_${subjectId}`
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem(key)) {
        setShowIntro(false)
      } else {
        sessionStorage.setItem(key, '1')
      }
    }
  }, [subjectId])

  const xpPct = Math.round((subject.xpEarned / subject.xpTotal) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <AnimatePresence>
        {showIntro && (
          <MarvelIntroOverlay
            subject={subject}
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${subject.gradient} overflow-hidden`}>
        {/* Mesh overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 90%, white 1px, transparent 1px),
              radial-gradient(circle at 90% 10%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/dashboard" className="hover:text-white/80 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/subjects" className="hover:text-white/80 transition-colors">
              Subjects
            </Link>
            <span>/</span>
            <span className="text-white">{subject.name}</span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-6">
            {/* Left: Subject info */}
            <div className="flex items-start gap-5">
              <motion.div
                className="text-7xl"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              >
                {subject.emoji}
              </motion.div>
              <div>
                <motion.h1
                  className="text-4xl font-black text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {subject.name}
                </motion.h1>
                <motion.p
                  className="text-white/60 max-w-md text-sm mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {subject.description}
                </motion.p>

                {/* Stats row */}
                <motion.div
                  className="flex flex-wrap gap-4 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { label: 'Level', value: `Lv. ${subject.level}`, icon: '⭐' },
                    {
                      label: 'XP',
                      value: `${subject.xpEarned.toLocaleString()} / ${subject.xpTotal.toLocaleString()}`,
                      icon: '⚡',
                    },
                    {
                      label: 'Chapters',
                      value: `${subject.chaptersCompleted}/${subject.totalChapters}`,
                      icon: '📖',
                    },
                    { label: 'Progress', value: `${subject.progress}%`, icon: '🎯' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full"
                    >
                      <span>{stat.icon}</span>
                      <span className="text-white/50 text-xs">{stat.label}:</span>
                      <span className="font-semibold text-white text-xs">{stat.value}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <motion.div
            className="mt-8 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>XP Progress</span>
              <span>{xpPct}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {TABS.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => setTab(t.id)}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-white text-gray-900'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{t.emoji}</span>
                {t.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {tab === 'chapters' && (
                  <ChaptersTab chapters={subject.chapters} subjectId={subject.id} />
                )}
                {tab === 'notes' && <NotesTab notes={subject.notes} />}
                {tab === 'flashcards' && <FlashcardsTab sets={subject.flashcardSets} />}
                {tab === 'simulations' && <SimulationsTab simulations={subject.simulations} />}
                {tab === 'videos' && <VideosTab videos={subject.videos} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <RightSidebar subject={subject} />
        </div>
      </div>
    </div>
  )
}
