'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface NeonButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: Variant
  size?: Size
  loading?: boolean
  className?: string
}

const sizeClasses: Record<Size, string> = {
  xs: 'px-3 py-1.5 text-xs gap-1.5',
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
}

const variantStyles: Record<
  Variant,
  {
    base: string
    hover: object
    glow: string
  }
> = {
  primary: {
    base: 'text-white font-semibold border border-transparent',
    hover: {
      boxShadow: '0 0 24px 6px rgba(249,115,22,0.55), 0 4px 16px rgba(234,88,12,0.4)',
    },
    glow: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #f59e0b 100%)',
  },
  secondary: {
    base: 'text-orange-400 font-semibold bg-transparent',
    hover: {
      boxShadow: '0 0 16px 4px rgba(249,115,22,0.35)',
    },
    glow: 'transparent',
  },
  ghost: {
    base: 'text-orange-300 font-medium bg-transparent border-transparent',
    hover: {
      boxShadow: '0 0 12px 2px rgba(249,115,22,0.2)',
    },
    glow: 'transparent',
  },
  danger: {
    base: 'text-white font-semibold border border-transparent',
    hover: {
      boxShadow: '0 0 24px 6px rgba(239,68,68,0.55), 0 4px 16px rgba(220,38,38,0.4)',
    },
    glow: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
  },
}

function Spinner() {
  return (
    <motion.span
      className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    />
  )
}

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...rest
}: NeonButtonProps) {
  const vs = variantStyles[variant]
  const isDisabled = disabled || loading

  // Build background
  let background = vs.glow
  if (variant === 'secondary') {
    background = 'transparent'
  }
  if (variant === 'ghost') {
    background = 'transparent'
  }

  // Border for secondary
  const borderStyle =
    variant === 'secondary'
      ? '1.5px solid rgba(249,115,22,0.65)'
      : variant === 'ghost'
      ? 'none'
      : undefined

  return (
    <motion.button
      {...rest}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center rounded-xl overflow-hidden
        transition-colors duration-200 focus:outline-none focus-visible:ring-2
        focus-visible:ring-orange-400 focus-visible:ring-offset-2
        focus-visible:ring-offset-transparent select-none
        ${sizeClasses[size]}
        ${vs.base}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background,
        border: borderStyle,
      }}
      whileHover={
        !isDisabled
          ? {
              scale: 1.035,
              ...vs.hover,
            }
          : {}
      }
      whileTap={!isDisabled ? { scale: 0.96 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {/* Secondary fill-in overlay */}
      {variant === 'secondary' && (
        <motion.span
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(234,88,12,0.15) 0%, rgba(249,115,22,0.12) 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Ghost hover glow text */}
      {variant === 'ghost' && (
        <motion.span
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          style={{
            background: 'rgba(249,115,22,0.07)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Shimmer for primary/danger */}
      {(variant === 'primary' || variant === 'danger') && (
        <motion.span
          className="absolute inset-y-0 pointer-events-none"
          style={{
            width: '40%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
          }}
          animate={{ left: ['-40%', '140%'] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading && <Spinner />}
        {children}
      </span>
    </motion.button>
  )
}
