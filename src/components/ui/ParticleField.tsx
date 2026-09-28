'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
  drift: number
}

const COLORS = [
  'rgba(249,115,22,',   // orange-500
  'rgba(251,146,60,',   // orange-400
  'rgba(245,158,11,',   // amber-500
  'rgba(252,211,77,',   // amber-300
  'rgba(239,68,68,',    // red-500
  'rgba(253,186,116,',  // orange-300
]

function createParticle(canvasWidth: number, canvasHeight: number): Particle {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: 1 + Math.random() * 2,         // 1–3px
    speed: 0.3 + Math.random() * 0.8,    // upward speed
    opacity: 0.15 + Math.random() * 0.55,
    color,
    drift: (Math.random() - 0.5) * 0.4,  // slight horizontal drift
  }
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles = Array.from({ length: 80 }, () =>
        createParticle(canvas.width, canvas.height)
      )
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        // Move upward + drift
        p.y -= p.speed
        p.x += p.drift

        // Wrap around top
        if (p.y < -p.size) {
          p.y = canvas.height + p.size
          p.x = Math.random() * canvas.width
        }
        // Wrap horizontal
        if (p.x < -p.size) p.x = canvas.width + p.size
        if (p.x > canvas.width + p.size) p.x = -p.size

        // Flicker opacity slightly
        p.opacity += (Math.random() - 0.5) * 0.02
        p.opacity = Math.max(0.05, Math.min(0.75, p.opacity))

        // Draw ember glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
        gradient.addColorStop(0, `${p.color}${p.opacity.toFixed(2)})`)
        gradient.addColorStop(1, `${p.color}0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core bright dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.min(p.opacity + 0.3, 1).toFixed(2)})`
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  )
}
