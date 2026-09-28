'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let isHovering = false
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      const target = e.target as HTMLElement
      isHovering =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.classList.contains('cursor-hover')
    }

    const animate = () => {
      // Dot snaps immediately
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`

      // Ring lerps with lag
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      if (isHovering) {
        ring.style.width = '56px'
        ring.style.height = '56px'
        ring.style.transform = `translate(${ringX - 28}px, ${ringY - 28}px)`
        ring.style.borderColor = '#fb923c'
        ring.style.boxShadow = '0 0 16px 4px rgba(251,146,60,0.55)'
        ring.style.opacity = '1'
      } else {
        ring.style.width = '36px'
        ring.style.height = '36px'
        ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`
        ring.style.borderColor = 'rgba(249,115,22,0.7)'
        ring.style.boxShadow = '0 0 8px 2px rgba(249,115,22,0.25)'
        ring.style.opacity = '0.85'
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Cursor Dot */}
      <div
        ref={dotRef}
        id="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#f97316',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: '0 0 8px 2px rgba(249,115,22,0.8)',
          transition: 'background-color 0.15s ease',
          willChange: 'transform',
        }}
      />

      {/* Cursor Ring */}
      <div
        ref={ringRef}
        id="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '2px solid rgba(249,115,22,0.7)',
          pointerEvents: 'none',
          zIndex: 99998,
          boxShadow: '0 0 8px 2px rgba(249,115,22,0.25)',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          willChange: 'transform',
          opacity: 0.85,
        }}
      />
    </>
  )
}
