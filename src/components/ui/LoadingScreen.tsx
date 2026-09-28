'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  message?: string
  isVisible: boolean
}

function PhoenixSVG() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Body */}
      <motion.path
        d="M50 80 C35 65 20 55 28 38 C34 26 46 22 50 20 C54 22 66 26 72 38 C80 55 65 65 50 80Z"
        fill="url(#phoenixBody)"
        animate={{ scale: [1, 1.04, 1], y: [0, -2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 50px' }}
      />
      {/* Left wing */}
      <motion.path
        d="M50 45 C40 40 18 42 12 30 C22 28 36 34 50 45Z"
        fill="url(#phoenixWing)"
        animate={{ rotate: [-6, 4, -6], x: [0, -2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 45px' }}
      />
      {/* Right wing */}
      <motion.path
        d="M50 45 C60 40 82 42 88 30 C78 28 64 34 50 45Z"
        fill="url(#phoenixWing2)"
        animate={{ rotate: [6, -4, 6], x: [0, 2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 45px' }}
      />
      {/* Tail feathers */}
      <motion.path
        d="M50 80 C44 85 38 95 42 98 C46 95 50 88 50 80Z"
        fill="url(#tail)"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 80px' }}
      />
      <motion.path
        d="M50 80 C56 85 62 95 58 98 C54 95 50 88 50 80Z"
        fill="url(#tail2)"
        animate={{ rotate: [3, -3, 3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 80px' }}
      />
      {/* Eye glow */}
      <motion.circle
        cx="46"
        cy="34"
        r="2.5"
        fill="#fbbf24"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      <defs>
        <radialGradient id="phoenixBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
        <linearGradient id="phoenixWing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="phoenixWing2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="tail" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="tail2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function LoadingScreen({
  message = 'Loading your learning universe...',
  isVisible,
}: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              'radial-gradient(ellipse at center, #1a0a00 0%, #0d0500 50%, #000000 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Outer ambient glow */}
          <div
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden="true"
          />

          {/* Pulsing ring */}
          <div className="relative flex items-center justify-center w-48 h-48">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(249,115,22,0.5)',
              }}
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.5, 1, 0.5],
                boxShadow: [
                  '0 0 20px 4px rgba(249,115,22,0.2)',
                  '0 0 40px 10px rgba(249,115,22,0.5)',
                  '0 0 20px 4px rgba(249,115,22,0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Middle spinning arc */}
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                border: '2px solid transparent',
                borderTopColor: '#f97316',
                borderRightColor: 'rgba(249,115,22,0.3)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner ring */}
            <motion.div
              className="absolute inset-6 rounded-full"
              style={{
                border: '1px solid rgba(245,158,11,0.4)',
              }}
              animate={{
                scale: [1, 0.92, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />

            {/* Phoenix SVG */}
            <div className="relative z-10 w-20 h-20">
              <PhoenixSVG />
            </div>
          </div>

          {/* Brand name */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-2xl font-black tracking-widest uppercase mb-1">
              <span
                style={{
                  background:
                    'linear-gradient(90deg, #f97316, #fbbf24, #f97316)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer-text 2.5s linear infinite',
                }}
              >
                PhoenixLearn
              </span>
            </h1>

            {/* Loading message with shimmer */}
            <motion.p
              className="text-sm font-medium mt-3 relative overflow-hidden"
              style={{ color: 'rgba(249,115,22,0.65)' }}
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {message}
            </motion.p>
          </motion.div>

          {/* Bottom progress dots */}
          <motion.div
            className="flex gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-orange-500"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          <style>{`
            @keyframes shimmer-text {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
