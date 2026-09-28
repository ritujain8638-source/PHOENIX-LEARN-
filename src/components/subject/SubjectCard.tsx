'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

export interface Subject {
  id: string
  name: string
  emoji: string
  description: string
  color: string
  gradient: string
  glowColor: string
  totalChapters: number
  totalXP: number
}

interface SubjectCardProps {
  subject: Subject
  progress?: number
  chaptersCompleted?: number
  totalChapters?: number
  enrolled?: boolean
  onEnroll?: (subject: Subject) => void
  onContinue?: (subject: Subject) => void
}

// SVG Progress Ring
function ProgressRing({
  progress,
  size = 64,
  stroke = 5,
  color,
}: {
  progress: number
  size?: number
  stroke?: number
  color: string
}) {
  const radius = (size - stroke * 2) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={stroke}
        fill="none"
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  )
}

export default function SubjectCard({
  subject,
  progress = 0,
  chaptersCompleted = 0,
  totalChapters,
  enrolled = false,
  onEnroll,
  onContinue,
}: SubjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const chapters = totalChapters ?? subject.totalChapters

  // 3D tilt values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const xpEarned = Math.floor((progress / 100) * subject.totalXP)

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${subject.gradient} opacity-90`}
      />

      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 40px 10px ${subject.glowColor}`,
        }}
      />

      {/* Animated shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
      />

      {/* Mesh pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-5">
        {/* Top row: emoji + enrolled badge */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="text-4xl"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            {subject.emoji}
          </motion.div>

          {enrolled && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-0.5 text-[10px] font-bold tracking-widest bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full"
            >
              ENROLLED
            </motion.span>
          )}
        </div>

        {/* Subject name */}
        <h3 className="text-white font-bold text-lg mb-1 leading-tight">{subject.name}</h3>
        <p className="text-white/70 text-xs mb-4 line-clamp-2">{subject.description}</p>

        {/* Progress section */}
        {enrolled ? (
          <>
            {/* Stats row */}
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/60 text-[10px]">CHAPTERS</span>
                  <span className="text-white text-xs font-semibold">
                    {chaptersCompleted}/{chapters}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/60 text-[10px]">XP EARNED</span>
                  <span className="text-yellow-300 text-xs font-semibold">
                    {xpEarned.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative flex items-center justify-center">
                <ProgressRing progress={progress} color="rgba(255,255,255,0.9)" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{progress}%</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
              <motion.div
                className="h-1.5 rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
            </div>

            {/* Continue button */}
            <motion.button
              onClick={() => onContinue?.(subject)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              {progress === 0 ? '🚀 Start Learning' : '▶ Continue'}
            </motion.button>
          </>
        ) : (
          <>
            {/* Available subject info */}
            <div className="flex items-center gap-3 mb-4 text-white/70 text-xs">
              <span>📚 {chapters} chapters</span>
              <span>⚡ {subject.totalXP.toLocaleString()} XP</span>
            </div>

            {/* Enroll button */}
            <motion.button
              onClick={() => onEnroll?.(subject)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 bg-white text-gray-900 text-sm font-bold rounded-xl transition-all duration-200 hover:bg-white/90"
            >
              + Enroll Now
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  )
}
