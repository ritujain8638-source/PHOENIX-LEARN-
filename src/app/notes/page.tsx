'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science']
const CHAPTERS = ['All', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5']
const TYPES = ['All', '2D', '3D', 'PDF']

const SUBJECT_COLORS: Record<string, { bg: string; border: string; badge: string; text: string; glow: string }> = {
  Mathematics:       { bg: 'from-orange-900/40 to-orange-800/20',  border: 'border-orange-500/40', badge: 'bg-orange-500/20 text-orange-300 border border-orange-500/40', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  Physics:           { bg: 'from-blue-900/40 to-blue-800/20',      border: 'border-blue-500/40',   badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',       text: 'text-blue-400',   glow: 'shadow-blue-500/20'   },
  Chemistry:         { bg: 'from-green-900/40 to-green-800/20',    border: 'border-green-500/40',  badge: 'bg-green-500/20 text-green-300 border border-green-500/40',     text: 'text-green-400',  glow: 'shadow-green-500/20'  },
  Biology:           { bg: 'from-purple-900/40 to-purple-800/20',  border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',  text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  'Computer Science':{ bg: 'from-cyan-900/40 to-cyan-800/20',      border: 'border-cyan-500/40',   badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',         text: 'text-cyan-400',   glow: 'shadow-cyan-500/20'   },
}

const TYPE_ICONS: Record<string, string> = { '2D': '📄', '3D': '📦', 'PDF': '🗂️' }

interface Note {
  id: string
  title: string
  subject: string
  chapter: string
  type: '2D' | '3D' | 'PDF'
  lastViewed: string
  mastery: number
  pages: number
  preview: string
}

const NOTES: Note[] = [
  { id: '1', title: 'Differential Calculus',        subject: 'Mathematics',        chapter: 'Chapter 3', type: '2D',  lastViewed: '2h ago',    mastery: 78, pages: 12, preview: 'Limits, derivatives, chain rule, implicit differentiation…' },
  { id: '2', title: 'Newton\'s Laws of Motion',     subject: 'Physics',            chapter: 'Chapter 1', type: '3D',  lastViewed: '1d ago',    mastery: 92, pages: 8,  preview: 'Force, mass, acceleration, free body diagrams…' },
  { id: '3', title: 'Organic Chemistry Reactions',  subject: 'Chemistry',          chapter: 'Chapter 4', type: 'PDF', lastViewed: '3d ago',    mastery: 45, pages: 20, preview: 'SN1, SN2, elimination reactions, nucleophiles…' },
  { id: '4', title: 'Cell Biology & Mitosis',       subject: 'Biology',            chapter: 'Chapter 2', type: '2D',  lastViewed: '5h ago',    mastery: 61, pages: 15, preview: 'Cell cycle, mitosis phases, cytokinesis…' },
  { id: '5', title: 'Data Structures',              subject: 'Computer Science',   chapter: 'Chapter 5', type: '3D',  lastViewed: '2d ago',    mastery: 83, pages: 18, preview: 'Arrays, linked lists, trees, graphs, hash maps…' },
  { id: '6', title: 'Integral Calculus',            subject: 'Mathematics',        chapter: 'Chapter 4', type: '2D',  lastViewed: '4h ago',    mastery: 55, pages: 14, preview: 'Riemann sums, definite integrals, FTC…' },
  { id: '7', title: 'Electromagnetism',             subject: 'Physics',            chapter: 'Chapter 3', type: '3D',  lastViewed: '6h ago',    mastery: 70, pages: 10, preview: 'Coulomb\'s law, electric fields, Gauss\'s law…' },
  { id: '8', title: 'Thermodynamics',               subject: 'Chemistry',          chapter: 'Chapter 2', type: '2D',  lastViewed: '1h ago',    mastery: 38, pages: 9,  preview: 'Enthalpy, entropy, Gibbs free energy, laws…' },
  { id: '9', title: 'Genetics & DNA',               subject: 'Biology',            chapter: 'Chapter 3', type: 'PDF', lastViewed: '8h ago',    mastery: 89, pages: 22, preview: 'DNA replication, transcription, translation…' },
  { id: '10', title: 'Algorithms & Complexity',     subject: 'Computer Science',   chapter: 'Chapter 3', type: '2D',  lastViewed: '3h ago',    mastery: 74, pages: 16, preview: 'Big-O notation, sorting, dynamic programming…' },
  { id: '11', title: 'Linear Algebra',              subject: 'Mathematics',        chapter: 'Chapter 2', type: '3D',  lastViewed: '2d ago',    mastery: 50, pages: 11, preview: 'Vectors, matrices, eigenvalues, linear maps…' },
  { id: '12', title: 'Quantum Mechanics Intro',     subject: 'Physics',            chapter: 'Chapter 5', type: 'PDF', lastViewed: '1w ago',    mastery: 22, pages: 25, preview: 'Wave-particle duality, Schrödinger equation…' },
]

const RECENT_NOTES = NOTES.slice(0, 4)

function MasteryBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  )
}

function NoteCard({ note }: { note: Note }) {
  const [flipped, setFlipped] = useState(false)
  const colors = SUBJECT_COLORS[note.subject] ?? SUBJECT_COLORS['Physics']

  return (
    <div
      className="relative h-56 cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-sm p-5 flex flex-col justify-between shadow-lg ${colors.glow}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>{note.subject}</span>
              <p className="mt-2 text-base font-bold text-white leading-tight">{note.title}</p>
              <p className="text-xs text-white/50 mt-1">{note.chapter}</p>
            </div>
            <span className="text-2xl select-none">{TYPE_ICONS[note.type]}</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/40">Mastery</span>
              <span className={`text-xs font-bold ${colors.text}`}>{note.mastery}%</span>
            </div>
            <MasteryBar value={note.mastery} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-white/30">{note.pages} pages</span>
              <span className="text-xs text-white/30">Viewed {note.lastViewed}</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-sm p-5 flex flex-col justify-between shadow-lg`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${colors.text} mb-2`}>Preview</p>
            <p className="text-sm text-white/80 leading-relaxed">{note.preview}</p>
          </div>
          <Link href={`/notes/${note.id}`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-2 rounded-xl text-sm font-semibold text-white ${colors.badge} border ${colors.border} mt-2`}
            >
              Open Note →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function NotesPage() {
  const [subject, setSubject] = useState('All')
  const [chapter, setChapter] = useState('All')
  const [type, setType] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = NOTES.filter(n => {
    if (subject !== 'All' && n.subject !== subject) return false
    if (chapter !== 'All' && n.chapter !== chapter) return false
    if (type !== 'All' && n.type !== type) return false
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              📚 My Notes
            </h1>
            <p className="text-xs text-white/40 mt-0.5">{NOTES.length} notes across {SUBJECTS.length - 1} subjects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
          >
            <span className="text-base">⬆️</span> Upload Notes
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Search + Filters */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-xl bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition"
          />
          <div className="flex flex-wrap gap-6">
            {/* Subject Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Subject</span>
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${subject === s ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Type</span>
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${type === t ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'}`}
                >
                  {t !== 'All' ? TYPE_ICONS[t] + ' ' : ''}{t}
                </button>
              ))}
            </div>
            {/* Chapter Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Chapter</span>
              {CHAPTERS.map(c => (
                <button
                  key={c}
                  onClick={() => setChapter(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${chapter === c ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notes */}
        <section>
          <h2 className="text-lg font-bold text-white/80 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-violet-500 rounded-full inline-block" />
            Recently Viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECENT_NOTES.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>

        {/* All Notes Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white/80 flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-500 rounded-full inline-block" />
              All Notes
              <span className="text-sm font-normal text-white/30 ml-1">({filtered.length})</span>
            </h2>
          </div>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-white/30 text-sm"
              >
                No notes match your filters.
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map((note, i) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <NoteCard note={note} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  )
}
