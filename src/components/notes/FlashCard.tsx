'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface FlashCardProps {
  front: string
  back: string
  subject?: string
  difficulty?: 1 | 2 | 3
  example?: string
  mastered?: boolean
  onMastered?: () => void
  onSkip?: () => void
  currentIndex?: number
  total?: number
  masteredCount?: number
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:        'bg-orange-500/20 text-orange-300 border-orange-500/40',
  Physics:            'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Chemistry:          'bg-green-500/20 text-green-300 border-green-500/40',
  Biology:            'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'Computer Science': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i <= level
              ? i === 1 ? 'bg-green-400' : i === 2 ? 'bg-yellow-400' : 'bg-red-400'
              : 'bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}

function ProgressBar({ current, total, mastered }: { current: number; total: number; mastered: number }) {
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-xs text-white/40">
        <span>Card {current} / {total}</span>
        <span className="text-green-400 font-semibold">{mastered} mastered</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex gap-px">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-colors duration-300 ${
              i < mastered ? 'bg-green-500' : i === current - 1 ? 'bg-violet-500' : 'bg-white/5'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function FlashCard({
  front,
  back,
  subject = 'Mathematics',
  difficulty = 2,
  example,
  mastered = false,
  onMastered,
  onSkip,
  currentIndex = 1,
  total = 10,
  masteredCount = 0,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [justActioned, setJustActioned] = useState<'mastered' | 'skip' | null>(null)

  const subjectClass = SUBJECT_COLORS[subject] ?? SUBJECT_COLORS['Mathematics']

  const handleMastered = () => {
    setJustActioned('mastered')
    setTimeout(() => {
      setFlipped(false)
      setJustActioned(null)
      onMastered?.()
    }, 400)
  }

  const handleSkip = () => {
    setJustActioned('skip')
    setTimeout(() => {
      setFlipped(false)
      setJustActioned(null)
      onSkip?.()
    }, 400)
  }

  return (
    <div className="w-full max-w-lg mx-auto select-none space-y-4">
      {/* Progress */}
      <ProgressBar current={currentIndex} total={total} mastered={masteredCount} />

      {/* Card */}
      <div
        className="relative h-72 cursor-pointer"
        style={{ perspective: '1200px' }}
        onClick={() => !justActioned && setFlipped(f => !f)}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-7 flex flex-col justify-between shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${subjectClass}`}>
                {subject}
              </span>
              <DifficultyDots level={difficulty} />
            </div>

            {/* Term */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl font-bold text-white text-center leading-snug">{front}</p>
            </div>

            {/* Hint */}
            <p className="text-xs text-white/30 text-center">Click to reveal definition →</p>

            {/* Mastered badge */}
            {mastered && (
              <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/40 text-green-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                ✓ Mastered
              </div>
            )}
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#1a0a2e] to-[#0d1b2a] p-7 flex flex-col justify-between shadow-2xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div>
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Definition</p>
              <p className="text-base text-white/90 leading-relaxed">{back}</p>
              {example && (
                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-yellow-400 font-semibold mb-1">Example</p>
                  <p className="text-sm text-white/70 font-mono">{example}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4" onClick={e => e.stopPropagation()}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleMastered}
                className="flex-1 py-2.5 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-semibold hover:bg-green-500/30 transition"
              >
                ✅ Got it!
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSkip}
                className="flex-1 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-semibold hover:bg-orange-500/30 transition"
              >
                🔁 Study again
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Flash on action */}
        <AnimatePresence>
          {justActioned && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 rounded-3xl pointer-events-none ${
                justActioned === 'mastered' ? 'bg-green-500/20' : 'bg-orange-500/20'
              }`}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Flip indicator */}
      <p className="text-center text-xs text-white/20">
        {flipped ? '← Back (showing definition)' : 'Front (showing term) →'}
      </p>
    </div>
  )
}
