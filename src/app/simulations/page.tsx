'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Simulation {
  id: string
  title: string
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'Computer Science'
  description: string
  tags: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  duration: string
  icon: string
  bgGradient: string
  badge: string
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const SIMULATIONS: Simulation[] = [
  {
    id: 'shm',
    title: 'Simple Harmonic Motion',
    subject: 'Physics',
    description: 'Explore pendulum and spring oscillations. Adjust length, gravity, and amplitude and observe the resulting period in real time.',
    tags: ['Oscillations', 'Waves', 'Pendulum'],
    difficulty: 'Easy',
    duration: '~10 min',
    icon: '🕰️',
    bgGradient: 'from-blue-900/50 to-blue-800/20',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'projectile',
    title: 'Projectile Motion',
    subject: 'Physics',
    description: 'Launch projectiles at adjustable angles and velocities. Visualize parabolic trajectories and measure range, height, and time of flight.',
    tags: ['Kinematics', 'Vectors', 'Gravity'],
    difficulty: 'Easy',
    duration: '~8 min',
    icon: '🚀',
    bgGradient: 'from-blue-900/50 to-indigo-800/20',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'circuit',
    title: 'Circuit Builder',
    subject: 'Physics',
    description: 'Drag and drop resistors, capacitors, and batteries to build circuits. Measure voltage, current, and power in real time.',
    tags: ['Electricity', 'Ohm\'s Law', 'Circuits'],
    difficulty: 'Medium',
    duration: '~20 min',
    icon: '⚡',
    bgGradient: 'from-yellow-900/50 to-blue-800/20',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table Explorer',
    subject: 'Chemistry',
    description: 'Interact with a 3D periodic table. Click any element to view atomic structure, electron configuration, properties, and isotopes.',
    tags: ['Elements', 'Atomic Structure', 'Bonding'],
    difficulty: 'Easy',
    duration: '~15 min',
    icon: '🧪',
    bgGradient: 'from-green-900/50 to-green-800/20',
    badge: 'bg-green-500/20 text-green-300 border-green-500/40',
  },
  {
    id: 'titration',
    title: 'Titration Lab',
    subject: 'Chemistry',
    description: 'Perform a virtual acid-base titration. Add titrant drop by drop and observe the pH curve and color indicator changes in real time.',
    tags: ['Acids & Bases', 'Equilibrium', 'Lab'],
    difficulty: 'Medium',
    duration: '~12 min',
    icon: '🔬',
    bgGradient: 'from-emerald-900/50 to-teal-800/20',
    badge: 'bg-green-500/20 text-green-300 border-green-500/40',
  },
  {
    id: 'cell-division',
    title: 'Cell Division',
    subject: 'Biology',
    description: 'Animate and control the stages of mitosis and meiosis step by step. See chromosomes, spindle fibers, and cytokinesis in action.',
    tags: ['Mitosis', 'Meiosis', 'Cell Cycle'],
    difficulty: 'Medium',
    duration: '~18 min',
    icon: '🧬',
    bgGradient: 'from-purple-900/50 to-purple-800/20',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    subject: 'Computer Science',
    description: 'Visualize bubble sort, merge sort, quicksort, and more side by side. Adjust array size and speed and watch comparisons in real time.',
    tags: ['Algorithms', 'Big-O', 'Sorting'],
    difficulty: 'Easy',
    duration: '~10 min',
    icon: '📊',
    bgGradient: 'from-cyan-900/50 to-cyan-800/20',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    id: 'unit-circle',
    title: 'Trigonometry Unit Circle',
    subject: 'Mathematics',
    description: 'Drag a point around the unit circle and observe sin, cos, and tan values update live. Visualize all six trig functions simultaneously.',
    tags: ['Trigonometry', 'Angles', 'Functions'],
    difficulty: 'Easy',
    duration: '~8 min',
    icon: '⭕',
    bgGradient: 'from-orange-900/50 to-orange-800/20',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  },
]

const SUBJECTS = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science']

const DIFFICULTY_COLORS = {
  Easy:   'bg-green-500/20 text-green-300 border border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  Hard:   'bg-red-500/20 text-red-300 border border-red-500/30',
}

const SUBJECT_SVG: Record<string, React.ReactNode> = {
  Physics: (
    <svg viewBox="0 0 80 60" className="w-full h-full opacity-60">
      <circle cx="40" cy="30" r="4" fill="#60a5fa" />
      <ellipse cx="40" cy="30" rx="30" ry="12" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="40" cy="30" rx="30" ry="12" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" transform="rotate(60 40 30)" />
      <ellipse cx="40" cy="30" rx="30" ry="12" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" transform="rotate(120 40 30)" />
    </svg>
  ),
  Chemistry: (
    <svg viewBox="0 0 80 60" className="w-full h-full opacity-60">
      <rect x="30" y="10" width="20" height="12" rx="3" fill="none" stroke="#4ade80" strokeWidth="1.5" />
      <path d="M25 22 L15 48 Q14 50 16 50 L64 50 Q66 50 65 48 L55 22 Z" fill="none" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="30" cy="38" r="3" fill="#4ade80" opacity="0.7" />
      <circle cx="50" cy="42" r="2" fill="#4ade80" opacity="0.7" />
      <circle cx="40" cy="34" r="2.5" fill="#4ade80" opacity="0.7" />
    </svg>
  ),
  Biology: (
    <svg viewBox="0 0 80 60" className="w-full h-full opacity-60">
      <ellipse cx="40" cy="30" rx="22" ry="16" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
      <ellipse cx="40" cy="30" rx="12" ry="8" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
      <circle cx="40" cy="30" r="4" fill="#a78bfa" opacity="0.6" />
      <line x1="18" y1="30" x2="62" y2="30" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  ),
  Mathematics: (
    <svg viewBox="0 0 80 60" className="w-full h-full opacity-60">
      <text x="8" y="35" fontSize="16" fill="#fb923c" fontFamily="monospace" opacity="0.8">∫</text>
      <text x="24" y="28" fontSize="10" fill="#fb923c" fontFamily="monospace" opacity="0.7">π</text>
      <text x="38" y="38" fontSize="13" fill="#fb923c" fontFamily="monospace" opacity="0.8">∑</text>
      <text x="54" y="28" fontSize="10" fill="#fb923c" fontFamily="monospace" opacity="0.7">√x</text>
      <text x="16" y="50" fontSize="10" fill="#fb923c" fontFamily="monospace" opacity="0.6">f'(x)</text>
      <text x="46" y="50" fontSize="10" fill="#fb923c" fontFamily="monospace" opacity="0.6">dx</text>
    </svg>
  ),
  'Computer Science': (
    <svg viewBox="0 0 80 60" className="w-full h-full opacity-60">
      <rect x="10" y="12" width="60" height="36" rx="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <text x="18" y="26" fontSize="8" fill="#22d3ee" fontFamily="monospace" opacity="0.9">{'if (n<2)'}</text>
      <text x="18" y="35" fontSize="8" fill="#22d3ee" fontFamily="monospace" opacity="0.9">{'  return n'}</text>
      <text x="18" y="44" fontSize="8" fill="#22d3ee" fontFamily="monospace" opacity="0.9">{'return f(n-1)'}</text>
    </svg>
  ),
}

function SimCard({ sim }: { sim: Simulation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${sim.bgGradient} backdrop-blur-sm overflow-hidden flex flex-col group cursor-pointer`}
    >
      {/* SVG Preview Thumbnail */}
      <div className="relative h-36 bg-black/30 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full p-4">{SUBJECT_SVG[sim.subject]}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${sim.badge} font-semibold`}>{sim.subject}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[sim.difficulty]}`}>{sim.difficulty}</span>
        </div>
        <div className="absolute bottom-3 right-3 text-3xl">{sim.icon}</div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-white mb-1">{sim.title}</h3>
        <p className="text-xs text-white/55 leading-relaxed flex-1">{sim.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {sim.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-white/30">⏱ {sim.duration}</span>
          <Link href={`/simulations/${sim.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border ${sim.badge} hover:bg-white/10 transition`}
            >
              🚀 Launch
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function SimulationsPage() {
  const [activeSubject, setActiveSubject] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = SIMULATIONS.filter(s => {
    if (activeSubject !== 'All' && s.subject !== activeSubject) return false
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              🔭 Simulations
            </h1>
            <p className="text-xs text-white/40 mt-0.5">Interactive science & math experiments</p>
          </div>
          <div className="text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            {SIMULATIONS.length} simulations available
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search simulations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition"
          />
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(s => (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  activeSubject === s
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banner */}
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/30 to-blue-800/10 p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-5xl">🕰️</div>
          <div className="flex-1">
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">Featured Simulation</p>
            <h2 className="text-xl font-bold text-white mb-1">Simple Harmonic Motion</h2>
            <p className="text-sm text-white/55">Explore pendulum and spring physics with real-time adjustable parameters and live graphs.</p>
          </div>
          <Link href="/simulations/shm">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20"
            >
              Launch Now →
            </motion.button>
          </Link>
        </div>

        {/* Grid */}
        <div>
          <p className="text-xs text-white/30 mb-5 font-semibold uppercase tracking-wider">
            {filtered.length} simulation{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-white/30 text-sm">No simulations found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((sim, i) => (
                <motion.div key={sim.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <SimCard sim={sim} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
