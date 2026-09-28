'use client'

import { motion } from 'framer-motion'

interface StreakDisplayProps {
  streak: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: {
    container: 'px-2 py-1 gap-1',
    flame: 'text-lg',
    number: 'text-sm font-bold',
    label: 'text-[10px]',
    glow: '0 0 10px 3px rgba(249,115,22,0.35)',
  },
  md: {
    container: 'px-3 py-1.5 gap-1.5',
    flame: 'text-2xl',
    number: 'text-lg font-bold',
    label: 'text-xs',
    glow: '0 0 18px 5px rgba(249,115,22,0.4)',
  },
  lg: {
    container: 'px-5 py-3 gap-2',
    flame: 'text-4xl',
    number: 'text-3xl font-extrabold',
    label: 'text-sm',
    glow: '0 0 28px 8px rgba(249,115,22,0.5)',
  },
}

export default function StreakDisplay({ streak, size = 'md' }: StreakDisplayProps) {
  const s = sizeMap[size]

  if (streak === 0) {
    return (
      <motion.div
        className={`inline-flex items-center ${s.container} rounded-full bg-white/5 border border-white/10`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <span className={s.flame} role="img" aria-label="flame">
          🔥
        </span>
        <span className={`${s.label} text-white/50 font-medium`}>Start your streak!</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`inline-flex items-center ${s.container} rounded-full`}
      style={{
        background:
          'linear-gradient(135deg, rgba(234,88,12,0.15) 0%, rgba(249,115,22,0.10) 50%, rgba(245,158,11,0.12) 100%)',
        border: '1px solid rgba(249,115,22,0.35)',
        boxShadow: s.glow,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Animated flame */}
      <motion.span
        className={s.flame}
        role="img"
        aria-label="flame"
        animate={{
          scale: [1, 1.18, 1, 1.12, 1],
          filter: [
            'drop-shadow(0 0 4px rgba(249,115,22,0.6))',
            'drop-shadow(0 0 10px rgba(249,115,22,0.95))',
            'drop-shadow(0 0 4px rgba(249,115,22,0.6))',
            'drop-shadow(0 0 8px rgba(249,115,22,0.85))',
            'drop-shadow(0 0 4px rgba(249,115,22,0.6))',
          ],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🔥
      </motion.span>

      {/* Streak number */}
      <motion.span
        className={`${s.number} text-orange-400 leading-none`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
        key={streak}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {streak}
      </motion.span>

      {/* Day label */}
      <span className={`${s.label} text-orange-300/70 font-medium`}>
        {streak === 1 ? 'day' : 'days'}
      </span>
    </motion.div>
  )
}
