'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface XPBarProps {
  currentXP: number
  maxXP: number
  level: number
  showLabel?: boolean
}

export default function XPBar({ currentXP, maxXP, level, showLabel = true }: XPBarProps) {
  const progress = useMotionValue(0)
  const pct = Math.min(Math.max((currentXP / maxXP) * 100, 0), 100)

  // Translate progress (0→pct) into a CSS width string
  const widthPct = useTransform(progress, [0, 100], ['0%', '100%'])

  useEffect(() => {
    const controls = animate(progress, pct, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    })
    return controls.stop
  }, [pct, progress])

  const shimmerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full select-none">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-orange-400 tracking-wider uppercase">
            LVL {level}
          </span>
          <span className="text-xs font-semibold text-orange-300/80">
            {currentXP.toLocaleString()}/{maxXP.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className="relative w-full h-3 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: widthPct,
            background: 'linear-gradient(90deg, #ea580c 0%, #f97316 35%, #f59e0b 70%, #fbbf24 100%)',
            boxShadow: '0 0 10px 2px rgba(249,115,22,0.5)',
          }}
        >
          {/* Shimmer overlay */}
          <div
            ref={shimmerRef}
            className="absolute inset-0 rounded-full overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-y-0"
              style={{
                width: '40%',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
              }}
              animate={{ left: ['-40%', '140%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Bright leading edge glow */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 rounded-full"
            style={{
              background: 'rgba(255,220,100,0.7)',
              filter: 'blur(2px)',
            }}
          />
        </motion.div>
      </div>

      {!showLabel && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-orange-400 tracking-wide">LVL {level}</span>
          <span className="text-[10px] text-orange-300/70">
            {currentXP}/{maxXP} XP
          </span>
        </div>
      )}
    </div>
  )
}
