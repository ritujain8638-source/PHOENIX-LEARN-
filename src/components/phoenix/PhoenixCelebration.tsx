'use client';

import React, { useEffect, useRef, useState } from 'react';

export type Celebrationtype = 'level-up' | 'perfect-score' | 'streak-milestone' | 'contest-win';

interface PhoenixCelebrationProps {
  type: Celebrationtype;
  message?: string;
  onComplete?: () => void;
}

interface Ember {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  angle: number;
  distance: number;
}

const CONFIG: Record<
  Celebrationtype,
  { headline: string; sub: string; color: string; glow: string; accent: string }
> = {
  'level-up': {
    headline: 'LEVEL UP!',
    sub: 'You unlocked a new challenge',
    color: 'from-orange-500 to-red-600',
    glow: 'rgba(251,146,60,0.8)',
    accent: '#fb923c',
  },
  'perfect-score': {
    headline: 'PERFECT SCORE!',
    sub: 'Flawless execution. Brilliant!',
    color: 'from-yellow-400 to-orange-500',
    glow: 'rgba(250,204,21,0.8)',
    accent: '#facc15',
  },
  'streak-milestone': {
    headline: 'STREAK MILESTONE!',
    sub: 'Your dedication is on fire 🔥',
    color: 'from-red-500 to-pink-600',
    glow: 'rgba(239,68,68,0.8)',
    accent: '#ef4444',
  },
  'contest-win': {
    headline: 'CONTEST WIN!',
    sub: 'Champion of the arena!',
    color: 'from-purple-500 to-indigo-600',
    glow: 'rgba(168,85,247,0.8)',
    accent: '#a855f7',
  },
};

const EMBER_COLORS = [
  '#f1c40f', '#e67e22', '#e74c3c', '#f39c12',
  '#fff176', '#ff6b35', '#ffd700', '#ff4500',
];

function generateEmbers(count: number): Ember[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20,    // percent from left — near center
    y: 40 + Math.random() * 20,    // percent from top  — near center
    size: 4 + Math.random() * 10,
    color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
    duration: 0.8 + Math.random() * 1.4,
    delay: Math.random() * 0.6,
    angle: Math.random() * 360,
    distance: 80 + Math.random() * 180,
  }));
}

const PhoenixCelebration: React.FC<PhoenixCelebrationProps> = ({
  type,
  message,
  onComplete,
}) => {
  const cfg = CONFIG[type];
  const [phase, setPhase] = useState<'enter' | 'display' | 'exit' | 'done'>('enter');
  const [embers] = useState<Ember[]>(() => generateEmbers(60));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* enter → display after 0.4s */
    timerRef.current = setTimeout(() => setPhase('display'), 400);
    /* display → exit after 2.8s */
    timerRef.current = setTimeout(() => setPhase('exit'), 2800);
    /* exit → done / onComplete after 3.6s */
    timerRef.current = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 3600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  const fadeClass =
    phase === 'enter'
      ? 'opacity-0'
      : phase === 'exit'
      ? 'opacity-0 scale-95'
      : 'opacity-100 scale-100';

  return (
    <>
      <style>{`
        /* Phoenix flight path */
        @keyframes phoenix-fly {
          0%   { transform: translate(-120px, 120px) rotate(-20deg) scale(0.6); opacity: 0; }
          15%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translate(calc(100vw + 120px), -120px) rotate(-20deg) scale(1.1); opacity: 0; }
        }

        /* Ember explosion */
        @keyframes ember-burst-VAR {
          0%   { transform: translate(0, 0) scale(1);   opacity: 1; }
          100% { transform: translate(var(--ex), var(--ey)) scale(0.2); opacity: 0; }
        }

        /* Headline slam */
        @keyframes headline-slam {
          0%   { transform: scale(2.5) translateY(-20px); opacity: 0; filter: blur(8px); }
          50%  { transform: scale(0.95) translateY(4px); opacity: 1; filter: blur(0); }
          65%  { transform: scale(1.04) translateY(-2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* Tagline fade */
        @keyframes tagline-fade {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Ring expand */
        @keyframes ring-expand {
          0%   { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(3);   opacity: 0; }
        }

        /* Shimmer scan */
        @keyframes shimmer-scan {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }

        /* Screen flash */
        @keyframes flash-in {
          0%, 100% { opacity: 0; }
          20%, 60%  { opacity: 0.15; }
        }

        .phoenix-fly-anim {
          animation: phoenix-fly 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .headline-slam-anim {
          animation: headline-slam 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        .tagline-fade-anim {
          animation: tagline-fade 0.5s ease forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }
        .ring-expand-anim {
          animation: ring-expand 1s ease-out forwards;
        }
        .shimmer-anim {
          animation: shimmer-scan 1.2s ease forwards;
          animation-delay: 0.3s;
        }
        .flash-anim {
          animation: flash-in 0.4s ease forwards;
        }
      `}</style>

      {/* ── Full-screen overlay ── */}
      <div
        className={`
          fixed inset-0 z-[200] flex items-center justify-center
          transition-all duration-500
          ${fadeClass}
        `}
        style={{ perspective: '1000px' }}
        aria-live="assertive"
        role="alert"
      >
        {/* Dark semi-transparent backdrop */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        {/* Screen color flash */}
        <div
          className="absolute inset-0 flash-anim pointer-events-none"
          style={{ background: cfg.glow }}
        />

        {/* ── Ember particles ── */}
        {phase === 'display' &&
          embers.map((ember) => {
            const radians = (ember.angle * Math.PI) / 180;
            const ex = Math.cos(radians) * ember.distance;
            const ey = Math.sin(radians) * ember.distance;
            return (
              <div
                key={ember.id}
                style={{
                  position: 'absolute',
                  left: `${ember.x}%`,
                  top: `${ember.y}%`,
                  width: ember.size,
                  height: ember.size,
                  borderRadius: ember.size > 7 ? '30%' : '50%',
                  background: ember.color,
                  boxShadow: `0 0 ${ember.size * 2}px ${ember.color}`,
                  // @ts-ignore CSS custom properties
                  '--ex': `${ex}px`,
                  '--ey': `${ey}px`,
                  animation: `ember-burst-VAR ${ember.duration}s ease-out ${ember.delay}s forwards`,
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            );
          })}

        {/* ── Expanding rings ── */}
        {[0, 0.25, 0.5].map((delay, i) => (
          <div
            key={i}
            className="absolute rounded-full ring-expand-anim pointer-events-none"
            style={{
              width: 200,
              height: 200,
              border: `3px solid ${cfg.accent}`,
              animationDelay: `${delay}s`,
              opacity: 0,
            }}
          />
        ))}

        {/* ── Phoenix flight ── */}
        <div
          className="absolute bottom-8 left-0 phoenix-fly-anim pointer-events-none"
          aria-hidden="true"
        >
          {/* Flame trail */}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: 120, height: 40 }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  right: i * 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16 - i * 1.5,
                  height: 16 - i * 1.5,
                  borderRadius: '50%',
                  background: EMBER_COLORS[i % EMBER_COLORS.length],
                  opacity: 1 - i * 0.12,
                  boxShadow: `0 0 ${(16 - i * 1.5) * 1.5}px ${EMBER_COLORS[i % EMBER_COLORS.length]}`,
                }}
              />
            ))}
          </div>
          {/* Phoenix silhouette */}
          <svg width="100" height="80" viewBox="0 0 160 130" fill="none">
            {/* Wings */}
            <path
              d="M80 80 C50 60 10 40 -10 20 C0 16 20 24 40 36 C20 20 18 4 26 2 C34 0 50 18 60 38 C52 20 54 6 62 4 C70 2 74 18 76 36 C72 16 74 2 82 2 C90 2 90 18 86 36 C90 18 98 6 106 8 C112 10 108 26 102 42 C110 28 120 18 126 20 C134 24 130 40 120 52 C130 40 142 34 148 36 C154 40 146 54 130 64Z"
              fill="url(#flySVGWing)"
            />
            <defs>
              <linearGradient id="flySVGWing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f1c40f" />
                <stop offset="50%" stopColor="#e67e22" />
                <stop offset="100%" stopColor="#c0392b" />
              </linearGradient>
            </defs>
            {/* Body */}
            <ellipse cx="80" cy="85" rx="16" ry="24" fill="#922b21" />
            {/* Head */}
            <ellipse cx="88" cy="65" rx="13" ry="11" fill="#922b21" />
            {/* Eye */}
            <circle cx="93" cy="63" r="4" fill="#f1c40f" />
            <circle cx="94" cy="63" r="2" fill="#1a0a00" />
            {/* Beak */}
            <path d="M100 65 C106 63 108 65 106 68 C103 69 100 68 100 65Z" fill="#f39c12" />
          </svg>
        </div>

        {/* ── Central text content ── */}
        <div className="relative z-10 text-center px-8 select-none">
          {/* Headline */}
          <div className="headline-slam-anim">
            <h1
              className={`
                text-6xl md:text-8xl font-black tracking-tight
                bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent
                drop-shadow-2xl leading-none relative overflow-hidden
              `}
              style={{
                WebkitTextStroke: `2px ${cfg.accent}`,
                textShadow: `0 0 40px ${cfg.glow}, 0 0 80px ${cfg.glow}`,
              }}
            >
              {message || cfg.headline}
              {/* Shimmer overlay */}
              <span
                className="shimmer-anim absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                aria-hidden="true"
              />
            </h1>
          </div>

          {/* Sub-text */}
          <p
            className="tagline-fade-anim text-lg md:text-2xl text-white/80 mt-4 font-medium tracking-widest uppercase"
            style={{ textShadow: `0 0 20px ${cfg.glow}` }}
          >
            {cfg.sub}
          </p>

          {/* Decorative line */}
          <div
            className="tagline-fade-anim mx-auto mt-6 h-0.5 w-48 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${cfg.accent}, transparent)`,
              boxShadow: `0 0 10px ${cfg.glow}`,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PhoenixCelebration;
