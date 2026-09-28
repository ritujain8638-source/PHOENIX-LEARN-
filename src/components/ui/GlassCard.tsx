'use client'

import { motion } from 'framer-motion'
import { ReactNode, MouseEvent } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  glowColor?: string
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

export default function GlassCard({
  children,
  className = '',
  hoverable = false,
  glowColor = 'rgba(249,115,22,0.45)',
  onClick,
}: GlassCardProps) {
  const isClickable = !!onClick

  return (
    <motion.div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
      whileHover={
        hoverable
          ? {
              scale: 1.015,
              borderColor: glowColor,
              boxShadow: `0 0 24px 4px ${glowColor}, 0 8px 32px rgba(0,0,0,0.35)`,
            }
          : {}
      }
      whileTap={isClickable ? { scale: 0.985 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Subtle inner top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Glow overlay on hover (decorative layer) */}
      {hoverable && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${glowColor.replace('0.45', '0.08')} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
