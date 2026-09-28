'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subject } from '@/types';

interface MarvelIntroProps {
  subject: Subject;
  onComplete: () => void;
}

export default function MarvelIntro({ subject, onComplete }: MarvelIntroProps) {
  const [phase, setPhase] = useState<'flipping' | 'slam' | 'glow' | 'exit'>('flipping');

  useEffect(() => {
    // Phase 1: Comic book fast page flipping (0ms - 1200ms)
    const t1 = setTimeout(() => setPhase('slam'), 1400);
    // Phase 2: Logo slam with screen shake & audio-visual shockwave (1400ms - 2800ms)
    const t2 = setTimeout(() => setPhase('glow'), 2800);
    // Phase 3: Tagline reveal & subtle cinematic glow (2800ms - 3800ms)
    const t3 = setTimeout(() => setPhase('exit'), 3800);
    // Phase 4: Complete and smoothly hand over to subject view
    const t4 = setTimeout(() => onComplete(), 4400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Comic flick cards simulating textbook pages (RD Sharma formulas, Physics laws, etc.)
  const comicFlicks = [
    '∫ e^x (f(x) + f\'(x)) dx',
    '∇ × B = μ₀J + μ₀ε₀(∂E/∂t)',
    'E = mc²',
    'ΔG° = -RT ln K',
    'x = (-b ± √(b²-4ac)) / 2a',
    'F = dp/dt',
    'PV = nRT',
    'λ = h / mv'
  ];

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
        >
          {/* Background glowing aura matching the subject color */}
          <div
            className="absolute inset-0 opacity-40 blur-[140px] pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${subject.color} 0%, transparent 70%)`
            }}
          />

          {/* Film Grain & Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-30 pointer-events-none" />

          {/* Phase 1: Fast comic page flip animation */}
          {phase === 'flipping' && (
            <div className="relative w-80 h-44 flex items-center justify-center border-4 border-white/20 bg-zinc-950/90 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden">
              <motion.div
                animate={{
                  y: [-300, 300],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.25,
                  ease: 'linear'
                }}
                className="flex flex-col gap-4 text-center font-mono text-xs tracking-wider text-amber-300/80"
              >
                {comicFlicks.concat(comicFlicks).map((text, idx) => (
                  <div key={idx} className="border-b border-white/10 py-1 font-bold">
                    {text}
                  </div>
                ))}
              </motion.div>
              <div className="absolute inset-0 bg-red-600/20 mix-blend-color-dodge pointer-events-none" />
              <div className="absolute bottom-2 right-3 text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
                ARCHIVES // {subject.shortName}
              </div>
            </div>
          )}

          {/* Phase 2 & 3: Epic Marvel-Style Symbol & Title Slam */}
          {(phase === 'slam' || phase === 'glow') && (
            <div className="relative flex flex-col items-center text-center px-4">
              {/* Giant Symbol Backdrop with Glowing Emblem */}
              <motion.div
                initial={{ scale: 3.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center text-5xl md:text-6xl font-black mb-6 shadow-2xl relative"
                style={{
                  background: subject.gradient,
                  boxShadow: `0 0 80px ${subject.color}88, inset 0 0 25px rgba(255,255,255,0.4)`
                }}
              >
                <span className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {subject.marvelIntroSymbol}
                </span>

                {/* Animated shockwave ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                  style={{ borderColor: subject.color }}
                />
              </motion.div>

              {/* Title with Marvel Block Red/Silver styling */}
              <motion.div
                initial={{ y: 50, opacity: 0, letterSpacing: '0.5em' }}
                animate={{ y: 0, opacity: 1, letterSpacing: '0.15em' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="overflow-hidden"
              >
                <h1 className="text-4xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
                  {subject.marvelIntroTitle}
                </h1>
              </motion.div>

              {/* Tagline slam */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-3 text-sm md:text-lg font-mono tracking-[0.25em] text-zinc-300/90 uppercase"
              >
                {subject.marvelIntroTagline}
              </motion.p>

              {/* Phoenix Seal at bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex items-center gap-2 text-xs font-mono text-orange-400/90 tracking-widest border border-orange-500/30 px-3 py-1 rounded-full bg-orange-950/30 backdrop-blur-md"
              >
                <span>🔥</span> PHOENIX INTELLECT DOMAIN <span>🔥</span>
              </motion.div>
            </div>
          )}

          {/* Skip Intro Button */}
          <button
            onClick={onComplete}
            className="absolute bottom-6 right-6 text-xs font-mono tracking-widest text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full border border-white/10"
          >
            SKIP INTRO [ESC]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
