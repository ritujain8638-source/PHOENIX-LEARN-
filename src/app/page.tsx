"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ============================================================
   UTILITY: cn helper
   ============================================================ */
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/* ============================================================
   PHOENIX SVG — original adult fire-phoenix illustration
   ============================================================ */
function PhoenixSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PhoenixLearn mascot — adult fire phoenix"
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="55%" r="48%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="40%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#7C2D12" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="eyeGrad" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="60%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <linearGradient id="wingLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F97316" />
          <stop offset="80%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
        <linearGradient id="wingRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#F97316" />
          <stop offset="80%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
        <linearGradient id="tailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="crownGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Aura glow behind phoenix */}
      <ellipse cx="210" cy="310" rx="130" ry="90" fill="url(#glowGrad)" />

      {/* ── TAIL FEATHERS ── */}
      <path d="M210 370 Q175 420 140 470 Q165 440 170 400" fill="url(#tailGrad)" opacity="0.85" />
      <path d="M210 370 Q210 435 205 480 Q210 445 215 400" fill="url(#tailGrad)" opacity="0.9" />
      <path d="M210 370 Q245 420 280 470 Q255 440 250 400" fill="url(#tailGrad)" opacity="0.85" />
      <path d="M210 370 Q190 430 160 475 Q178 440 182 400" fill="#DC2626" opacity="0.5" />
      <path d="M210 370 Q230 430 260 475 Q242 440 238 400" fill="#DC2626" opacity="0.5" />
      {/* Tail tip flames */}
      <path d="M140 470 Q135 465 143 450 Q148 460 140 470Z" fill="#FCD34D" />
      <path d="M205 480 Q200 472 208 458 Q212 470 205 480Z" fill="#FCD34D" />
      <path d="M280 470 Q285 465 277 450 Q272 460 280 470Z" fill="#FCD34D" />

      {/* ── LEFT WING (spread wide) ── */}
      <path
        d="M195 220 Q150 170 60 130 Q90 155 100 185 Q50 160 20 175 Q65 185 80 210 Q30 200 10 230 Q60 225 85 250 Q45 255 35 285 Q80 270 110 285 Q85 310 90 340 Q125 310 150 320 Q140 345 150 370 Q175 340 185 360 Q185 320 210 300 Z"
        fill="url(#wingLeftGrad)"
        filter="url(#softGlow)"
      />
      {/* Wing feather lines left */}
      <path d="M195 220 Q155 175 65 135" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      <path d="M185 240 Q145 200 55 165" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <path d="M175 265 Q135 235 45 220" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.35" fill="none" />
      <path d="M165 295 Q125 275 40 270" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />

      {/* ── RIGHT WING (spread wide) ── */}
      <path
        d="M225 220 Q270 170 360 130 Q330 155 320 185 Q370 160 400 175 Q355 185 340 210 Q390 200 410 230 Q360 225 335 250 Q375 255 385 285 Q340 270 310 285 Q335 310 330 340 Q295 310 270 320 Q280 345 270 370 Q245 340 235 360 Q235 320 210 300 Z"
        fill="url(#wingRightGrad)"
        filter="url(#softGlow)"
      />
      {/* Wing feather lines right */}
      <path d="M225 220 Q265 175 355 135" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      <path d="M235 240 Q275 200 365 165" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <path d="M245 265 Q285 235 375 220" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.35" fill="none" />
      <path d="M255 295 Q295 275 380 270" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />

      {/* ── BODY ── */}
      <ellipse cx="210" cy="310" rx="58" ry="75" fill="url(#bodyGrad)" filter="url(#softGlow)" />
      {/* Body feather texture */}
      <path d="M180 290 Q190 275 210 285 Q230 275 240 290 Q225 300 210 295 Q195 300 180 290Z" fill="#FCD34D" opacity="0.35" />
      <path d="M178 320 Q190 305 210 315 Q230 305 242 320 Q225 330 210 325 Q195 330 178 320Z" fill="#FCD34D" opacity="0.3" />
      <path d="M183 350 Q193 338 210 345 Q227 338 237 350 Q223 360 210 355 Q197 360 183 350Z" fill="#FCD34D" opacity="0.25" />

      {/* ── NECK ── */}
      <path d="M190 240 Q195 210 210 200 Q225 210 230 240 Q220 235 210 238 Q200 235 190 240Z" fill="url(#bodyGrad)" />

      {/* ── HEAD ── */}
      <ellipse cx="210" cy="185" rx="42" ry="38" fill="url(#bodyGrad)" filter="url(#softGlow)" />

      {/* ── CROWN PLUMAGE ── */}
      <path d="M210 148 Q205 120 200 100 Q207 128 210 148Z" fill="url(#crownGrad)" />
      <path d="M210 148 Q198 122 188 104 Q200 128 210 148Z" fill="#F97316" />
      <path d="M210 148 Q222 122 232 104 Q220 128 210 148Z" fill="#F97316" />
      <path d="M210 148 Q192 130 178 115 Q196 136 210 148Z" fill="#DC2626" opacity="0.7" />
      <path d="M210 148 Q228 130 242 115 Q224 136 210 148Z" fill="#DC2626" opacity="0.7" />
      {/* Crown flame tips */}
      <ellipse cx="200" cy="100" rx="3" ry="6" fill="#FDE68A" />
      <ellipse cx="210" cy="97" rx="3.5" ry="7" fill="#FEF3C7" />
      <ellipse cx="220" cy="100" rx="3" ry="6" fill="#FDE68A" />
      <ellipse cx="190" cy="108" rx="2.5" ry="5" fill="#FCD34D" />
      <ellipse cx="230" cy="108" rx="2.5" ry="5" fill="#FCD34D" />

      {/* ── BEAK ── */}
      <path d="M210 188 Q220 185 228 195 Q218 198 210 195Z" fill="#92400E" />
      <path d="M210 188 Q202 185 196 193 Q204 196 210 195Z" fill="#B45309" />

      {/* ── EYES ── */}
      {/* Left eye */}
      <ellipse cx="194" cy="180" rx="10" ry="9" fill="#1C1917" />
      <ellipse cx="194" cy="180" rx="8" ry="7" fill="url(#eyeGrad)" />
      <ellipse cx="194" cy="180" rx="4" ry="4" fill="#1C1917" />
      <ellipse cx="191" cy="177" rx="2" ry="2" fill="white" opacity="0.9" />
      {/* Right eye */}
      <ellipse cx="226" cy="180" rx="10" ry="9" fill="#1C1917" />
      <ellipse cx="226" cy="180" rx="8" ry="7" fill="url(#eyeGrad)" />
      <ellipse cx="226" cy="180" rx="4" ry="4" fill="#1C1917" />
      <ellipse cx="223" cy="177" rx="2" ry="2" fill="white" opacity="0.9" />
      {/* Eye brow ridge markings */}
      <path d="M184 171 Q194 166 204 170" stroke="#7C2D12" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M216 170 Q226 166 236 171" stroke="#7C2D12" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* ── TALONS ── */}
      <path d="M195 380 Q192 395 185 405 Q190 400 193 390 Q196 398 195 408 Q199 398 200 388 Q203 396 205 405 Q206 395 203 382Z" fill="#7C2D12" />
      <path d="M225 380 Q228 395 235 405 Q230 400 227 390 Q224 398 225 408 Q221 398 220 388 Q217 396 215 405 Q214 395 217 382Z" fill="#7C2D12" />

      {/* ── FLAME WISPS around body ── */}
      <path d="M155 280 Q145 260 155 240 Q158 258 155 280Z" fill="#FCD34D" opacity="0.7" />
      <path d="M260 280 Q270 260 260 240 Q257 258 260 280Z" fill="#FCD34D" opacity="0.7" />
      <path d="M150 310 Q138 292 148 272 Q152 290 150 310Z" fill="#F97316" opacity="0.6" />
      <path d="M265 310 Q277 292 267 272 Q263 290 265 310Z" fill="#F97316" opacity="0.6" />
      <path d="M165 250 Q158 234 166 218 Q168 233 165 250Z" fill="#FDE68A" opacity="0.65" />
      <path d="M250 250 Q257 234 249 218 Q247 233 250 250Z" fill="#FDE68A" opacity="0.65" />
    </svg>
  );
}

/* ============================================================
   FLAME PARTICLES — pure CSS animation
   ============================================================ */
function FlameParticles() {
  const particles = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((i) => {
        const size = Math.random() * 8 + 3;
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = Math.random() * 4 + 4;
        const hue = Math.random() > 0.5 ? "#F97316" : Math.random() > 0.5 ? "#FCD34D" : "#DC2626";
        return (
          <span
            key={i}
            className="absolute rounded-full opacity-0"
            style={{
              width: size,
              height: size * 1.6,
              left: `${left}%`,
              bottom: "-10px",
              background: `radial-gradient(ellipse at 40% 30%, #FEF3C7, ${hue})`,
              boxShadow: `0 0 ${size * 2}px ${hue}`,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              animation: `floatUp ${duration}s ease-in ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.9; }
          50%  { transform: translateY(-40vh) scale(0.7) rotate(15deg); opacity: 0.6; }
          100% { transform: translateY(-80vh) scale(0.2) rotate(30deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   EMBER PARTICLES — small glowing dots for CTA section
   ============================================================ */
function EmberParticles({ count = 30 }: { count?: number }) {
  const embers = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {embers.map((i) => {
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 6 + 5;
        const drift = (Math.random() - 0.5) * 80;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "10%",
              background: "radial-gradient(circle, #FDE68A, #F97316)",
              boxShadow: "0 0 6px #F97316",
              animation: `emberFloat ${duration}s ease-in-out ${delay}s infinite`,
              "--drift": `${drift}px`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        @keyframes emberFloat {
          0%   { transform: translate(0, 0) scale(1);   opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate(var(--drift), -70vh) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   SECTION WRAPPER with fade-up animation
   ============================================================ */
function FadeSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   GRADIENT BADGE
   ============================================================ */
function GradientBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-amber-400 backdrop-blur-sm">
      {children}
    </span>
  );
}

/* ============================================================
   SECTION HEADING
   ============================================================ */
function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
}: {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-14", center && "text-center")}>
      {badge && (
        <div className={cn("mb-4", center && "flex justify-center")}>
          <GradientBadge>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {badge}
          </GradientBadge>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

/* ============================================================
   SCROLLING MARQUEE
   ============================================================ */
const MARQUEE_ITEMS = [
  { icon: "✦", label: "Adaptive AI Engine" },
  { icon: "✦", label: "3D Interactive Notes" },
  { icon: "✦", label: "Knowledge Map" },
  { icon: "✦", label: "Daily Streak System" },
  { icon: "✦", label: "Phoenix Path" },
  { icon: "✦", label: "Mock Test Engine" },
  { icon: "✦", label: "Live Simulations" },
  { icon: "✦", label: "National Contests" },
  { icon: "✦", label: "AI Copilot" },
  { icon: "✦", label: "Concept Mastery" },
];

function Marquee() {
  return (
    <div className="relative overflow-hidden py-5 border-y border-orange-900/40 bg-[#0D0500]">
      <div className="flex gap-0 w-max" style={{ animation: "marqueeScroll 28s linear infinite" }}>
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 px-8 text-sm font-semibold tracking-widest uppercase whitespace-nowrap"
          >
            <span className="text-orange-500 text-xs">{item.icon}</span>
            <span className="text-zinc-300 hover:text-amber-400 transition-colors">{item.label}</span>
          </span>
        ))}
      </div>
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0D0500] to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0D0500] to-transparent z-10" />
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function Hero() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, -120]);
  const opacityParallax = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080200]">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-orange-700/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-600/8 blur-[80px]" />
      </div>

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F97316 1px, transparent 1px), linear-gradient(to bottom, #F97316 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Flame particles */}
      <FlameParticles />

      {/* Content */}
      <motion.div
        style={{ y: yParallax, opacity: opacityParallax }}
        className="relative z-10 flex flex-col items-center text-center px-4 pt-24 pb-10 max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <GradientBadge>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Ignite Your Academic Journey
          </GradientBadge>
        </motion.div>

        {/* Main layout: text + phoenix + text */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-6 w-full">
          {/* Left text block */}
          <div className="flex-1 text-left hidden lg:block">
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-zinc-500 text-sm font-mono tracking-widest uppercase mb-3"
            >
              // Adaptive · Intelligent · Immersive
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="text-zinc-400 text-base leading-relaxed"
            >
              A next-generation learning platform that adapts to your pace, lights up concepts in 3D, and tracks your mastery like never before.
            </motion.p>
          </div>

          {/* Phoenix SVG center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-shrink-0"
          >
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full bg-orange-600/10 blur-3xl animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-64 rounded-full border border-orange-500/20"
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoenixSVG className="w-72 h-80 lg:w-80 lg:h-96 drop-shadow-[0_0_40px_rgba(249,115,22,0.5)]" />
            </motion.div>
          </motion.div>

          {/* Right text block */}
          <div className="flex-1 text-right hidden lg:block">
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-zinc-500 text-sm font-mono tracking-widest uppercase mb-3"
            >
              // Rise · Conquer · Excel
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="text-zinc-400 text-base leading-relaxed"
            >
              Built for JEE, NEET, and beyond — your AI-powered copilot for every concept, every exam, every dream.
            </motion.p>
          </div>
        </div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-4"
        >
          <h1 className="text-6xl sm:text-8xl lg:text-[105px] font-black tracking-tighter leading-none">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #FDE68A 0%, #F97316 35%, #DC2626 65%, #7C2D12 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              Phoenix
            </span>
            <span className="text-white">Learn</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 text-xl sm:text-2xl text-amber-400/90 font-light tracking-widest uppercase"
        >
          Rise Through Knowledge
        </motion.p>

        {/* Sub tagline mobile */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-4 lg:hidden text-zinc-400 text-sm max-w-md leading-relaxed"
        >
          A next-generation AI learning platform that adapts to your pace, lights up concepts in 3D, and tracks your mastery.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/auth"
            className="relative group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base tracking-wide text-white overflow-hidden"
            style={{ background: "linear-gradient(135deg, #EA580C, #DC2626)" }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Begin Your Journey
            </span>
            <span className="absolute inset-0 rounded-xl ring-1 ring-orange-500/60" />
          </Link>

          <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base tracking-wide text-zinc-300 border border-zinc-700 hover:border-orange-700/60 hover:text-white transition-all duration-300 bg-white/[0.03] backdrop-blur-sm">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600/30 to-orange-900/30 flex items-center justify-center border border-orange-700/30 group-hover:border-orange-500/50 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-400 ml-0.5">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </span>
            Watch Demo
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-zinc-600 tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-orange-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */
const HOW_STEPS = [
  {
    step: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Onboard",
    subtitle: "Smart Profiling",
    description:
      "Answer a short diagnostic quiz. PhoenixLearn maps your strengths, gaps, and learning style to craft a precision plan.",
    color: "from-amber-500 to-orange-600",
  },
  {
    step: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Learn Adaptively",
    subtitle: "AI-Driven Curriculum",
    description:
      "The AI Copilot adjusts difficulty in real time. Explore concepts in 3D, revisit weak areas automatically, and never feel lost.",
    color: "from-orange-500 to-red-600",
  },
  {
    step: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Conquer",
    subtitle: "Test. Compete. Excel.",
    description:
      "Take mock tests that mirror real exams, join national contests, and track your rising percentile on the Phoenix Path.",
    color: "from-red-500 to-rose-700",
  },
];

function HowItWorks() {
  return (
    <section className="relative py-28 px-4 bg-[#060100]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-orange-900/10 blur-[80px]" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-red-900/10 blur-[80px]" />
      </div>
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <SectionHeading
            badge="Process"
            title={<>How <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#F97316,#FCD34D)" }}>PhoenixLearn</span> Works</>}
            subtitle="Three transformative stages, from first login to exam-day confidence."
          />
        </FadeSection>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-20 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-gradient-to-r from-amber-700/40 via-orange-600/60 to-red-700/40" />

          {HOW_STEPS.map((step, idx) => (
            <FadeSection key={step.step} delay={idx * 0.15}>
              <div className="relative group flex flex-col items-center text-center p-8 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-orange-700/40 transition-all duration-500 hover:bg-white/[0.04]">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0500] border border-orange-800/60 text-orange-500 text-xs font-black tracking-widest">
                  {step.step}
                </div>
                {/* Icon circle */}
                <div
                  className={cn(
                    "mt-4 mb-6 w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg",
                    step.color
                  )}
                  style={{ boxShadow: "0 8px 32px rgba(249,115,22,0.25)" }}
                >
                  {step.icon}
                </div>
                <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-2">{step.subtitle}</p>
                <h3 className="text-2xl font-black text-white mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                {/* Arrow for all but last */}
                {idx < 2 && (
                  <div className="md:hidden mt-6 text-orange-700 text-2xl">↓</div>
                )}
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FEATURES GRID
   ============================================================ */
const FEATURES = [
  {
    icon: "🤖",
    title: "AI Copilot",
    description: "A GPT-powered tutor that answers your doubts, explains concepts, and quizzes you—available 24/7.",
    gradient: "from-violet-600/20 to-purple-900/20",
    border: "border-violet-700/30",
    glow: "rgba(139,92,246,0.15)",
    href: "/copilot",
  },
  {
    icon: "🔥",
    title: "Phoenix Path",
    description: "A personalized mastery roadmap that evolves daily based on your performance and learning velocity.",
    gradient: "from-orange-600/20 to-red-900/20",
    border: "border-orange-700/30",
    glow: "rgba(249,115,22,0.15)",
    href: "/learn",
  },
  {
    icon: "🗺️",
    title: "Knowledge Map",
    description: "Visualize every concept and its prerequisites as an interactive mind-map. Navigate your curriculum spatially.",
    gradient: "from-emerald-600/20 to-teal-900/20",
    border: "border-emerald-700/30",
    glow: "rgba(16,185,129,0.15)",
    href: "/knowledge-map",
  },
  {
    icon: "📐",
    title: "3D Notes",
    description: "Rich multimedia notes with embedded 3D molecular models, physics simulations, and interactive graphs.",
    gradient: "from-sky-600/20 to-blue-900/20",
    border: "border-sky-700/30",
    glow: "rgba(14,165,233,0.15)",
    href: "/notes",
  },
  {
    icon: "📝",
    title: "Mock Tests",
    description: "Full-length JEE/NEET-pattern mock exams with detailed analytics, time distribution, and weakness reports.",
    gradient: "from-amber-600/20 to-yellow-900/20",
    border: "border-amber-700/30",
    glow: "rgba(245,158,11,0.15)",
    href: "/quiz",
  },
  {
    icon: "🏆",
    title: "National Contests",
    description: "Weekly rated contests. Climb national leaderboards and earn Phoenix Tier badges that matter.",
    gradient: "from-rose-600/20 to-pink-900/20",
    border: "border-rose-700/30",
    glow: "rgba(244,63,94,0.15)",
    href: "/contest",
  },
  {
    icon: "⚗️",
    title: "Simulations",
    description: "Hands-on virtual labs — titrate acids, simulate circuits, dissect frogs — right in your browser.",
    gradient: "from-lime-600/20 to-green-900/20",
    border: "border-lime-700/30",
    glow: "rgba(132,204,22,0.15)",
    href: "/simulations",
  },
  {
    icon: "🔥",
    title: "Streak System",
    description: "Earn Phoenix Flames for daily study streaks. Maintain your fire, unlock power-ups, and stay unstoppable.",
    gradient: "from-orange-700/20 to-amber-900/20",
    border: "border-orange-600/30",
    glow: "rgba(234,88,12,0.15)",
    href: "/dashboard",
  },
];

function FeaturesGrid() {
  return (
    <section className="relative py-28 px-4 bg-[#080200]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-900/40 to-transparent" />
      </div>
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <SectionHeading
            badge="Platform"
            title={<>Everything You Need to <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#F97316,#FCD34D)" }}>Rise</span></>}
            subtitle="Eight powerful pillars engineered to take you from zero to mastery."
          />
        </FadeSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat, idx) => (
            <FadeSection key={feat.title} delay={idx * 0.07}>
              <Link
                href={feat.href}
                className={cn(
                  "group relative flex flex-col p-6 rounded-2xl border bg-gradient-to-br transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl overflow-hidden",
                  feat.gradient,
                  feat.border
                )}
                style={{ boxShadow: `0 0 0 0 ${feat.glow}` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px 4px ${feat.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${feat.glow}`;
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${feat.glow}, transparent 70%)` }} />
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h3 className="text-lg font-black text-white mb-2 tracking-tight">{feat.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">{feat.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  Explore <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 group-hover:translate-x-1 transition-transform" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </Link>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SUBJECTS SHOWCASE
   ============================================================ */
const SUBJECTS = [
  {
    name: "Mathematics",
    code: "MATH",
    emoji: "∑",
    gradient: "from-blue-600 to-indigo-700",
    bgGrad: "from-blue-600/10 to-indigo-900/10",
    border: "border-blue-700/30",
    teaser: "Calculus, Algebra, Coordinate Geometry, Trigonometry, Statistics — mastered through adaptive problem sets and visual proofs.",
    topics: ["Calculus", "Algebra", "Vectors", "Probability"],
    color: "#6366F1",
  },
  {
    name: "Physics",
    code: "PHY",
    emoji: "⚡",
    gradient: "from-amber-500 to-orange-700",
    bgGrad: "from-amber-600/10 to-orange-900/10",
    border: "border-amber-700/30",
    teaser: "From Newtonian mechanics to quantum phenomena — interactive simulations make the invisible visible.",
    topics: ["Mechanics", "Electromagnetism", "Optics", "Thermodynamics"],
    color: "#F97316",
  },
  {
    name: "Chemistry",
    code: "CHEM",
    emoji: "⚗",
    gradient: "from-emerald-500 to-teal-700",
    bgGrad: "from-emerald-600/10 to-teal-900/10",
    border: "border-emerald-700/30",
    teaser: "3D molecular models, reaction mechanisms, and virtual titration labs — chemistry comes alive on PhoenixLearn.",
    topics: ["Organic", "Inorganic", "Physical", "Reactions"],
    color: "#10B981",
  },
  {
    name: "Biology",
    code: "BIO",
    emoji: "🧬",
    gradient: "from-rose-500 to-pink-700",
    bgGrad: "from-rose-600/10 to-pink-900/10",
    border: "border-rose-700/30",
    teaser: "Cell biology to ecology — interactive diagrams, virtual dissections, and NEET-focused question banks.",
    topics: ["Cell Biology", "Genetics", "Ecology", "Physiology"],
    color: "#F43F5E",
  },
  {
    name: "Computer Science",
    code: "CS",
    emoji: "</>",
    gradient: "from-violet-500 to-purple-800",
    bgGrad: "from-violet-600/10 to-purple-900/10",
    border: "border-violet-700/30",
    teaser: "Data structures, algorithms, system design, and competitive programming — from basics to FAANG-level.",
    topics: ["DSA", "Algorithms", "OOP", "Competitive"],
    color: "#8B5CF6",
  },
];

function SubjectsShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-28 px-4 bg-[#060100]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-orange-900/30 to-transparent" />
      </div>
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <SectionHeading
            badge="Subjects"
            title={<>Master Every <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#F97316,#FCD34D)" }}>Discipline</span></>}
            subtitle="Deep-dive subject coverage powered by AI, simulations, and expert-crafted content."
          />
        </FadeSection>

        {/* Subject Tab Pills */}
        <FadeSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {SUBJECTS.map((sub, idx) => (
              <button
                key={sub.code}
                onClick={() => setActive(idx)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border",
                  active === idx
                    ? `bg-gradient-to-br ${sub.gradient} text-white border-transparent shadow-lg`
                    : "bg-white/[0.03] text-zinc-400 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-200"
                )}
                style={active === idx ? { boxShadow: `0 4px 24px ${sub.color}40` } : {}}
              >
                <span className="mr-2">{sub.emoji}</span>
                {sub.name}
              </button>
            ))}
          </div>
        </FadeSection>

        {/* Active Subject Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {SUBJECTS.map((sub, idx) => (
              idx === active && (
                <div
                  key={sub.code}
                  className={cn(
                    "relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start",
                    sub.bgGrad,
                    sub.border
                  )}
                  style={{ boxShadow: `0 0 60px ${sub.color}20` }}
                >
                  {/* Decorative background blur */}
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
                    style={{ background: sub.color }} />

                  {/* Icon */}
                  <div
                    className={cn("flex-shrink-0 w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br shadow-2xl", sub.gradient)}
                    style={{ boxShadow: `0 8px 40px ${sub.color}50` }}
                  >
                    {sub.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: sub.color }}>{sub.code}</p>
                    <h3 className="text-3xl font-black text-white mb-3">{sub.name}</h3>
                    <p className="text-zinc-300 leading-relaxed mb-6 max-w-xl">{sub.teaser}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {sub.topics.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/[0.07] text-zinc-300 border border-white/[0.08]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/subjects`}
                      className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-br transition-all hover:scale-105",
                        sub.gradient
                      )}
                      style={{ boxShadow: `0 4px 20px ${sub.color}40` }}
                    >
                      Explore {sub.name}
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ============================================================
   STATISTICS BAR
   ============================================================ */
const STATS = [
  { value: "50K+", label: "Active Students", icon: "👩‍🎓" },
  { value: "10K+", label: "Questions Bank", icon: "📚" },
  { value: "200+", label: "Topics Covered", icon: "🗂️" },
  { value: "95%", label: "Success Rate", icon: "🏆" },
];

function StatCounter({ value, label, icon, delay }: { value: string; label: string; icon: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(value.replace(/[^0-9]/g, ""));
    const suffix = value.replace(/[0-9]/g, "");
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = numeric / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numeric) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start) + suffix);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="flex flex-col items-center gap-2 px-8 py-6"
    >
      <span className="text-3xl mb-1">{icon}</span>
      <span className="text-4xl md:text-5xl font-black text-white tracking-tight"
        style={{ textShadow: "0 0 30px rgba(249,115,22,0.4)" }}>
        {inView ? display : "0"}
      </span>
      <span className="text-sm text-zinc-500 font-medium tracking-wide">{label}</span>
    </motion.div>
  );
}

function StatsBar() {
  return (
    <section className="relative py-4 bg-[#080200]">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-orange-900/30"
          style={{ background: "linear-gradient(135deg, rgba(234,88,12,0.08), rgba(220,38,38,0.06), rgba(0,0,0,0.8))" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.07), transparent 70%)" }} />
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-orange-900/20">
            {STATS.map((stat, idx) => (
              <StatCounter key={stat.label} {...stat} delay={idx * 0.12} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "JEE Advanced 2025 — AIR 247",
    avatar: "AS",
    avatarGrad: "from-amber-500 to-orange-700",
    text: "PhoenixLearn's AI Copilot explained integration concepts to me at 2 AM the night before my mock test. The Knowledge Map completely changed how I see Physics — everything is connected now. I jumped from 60th to 98th percentile in two months.",
    stars: 5,
  },
  {
    name: "Priya Nair",
    role: "NEET 2025 — 720/720",
    avatar: "PN",
    avatarGrad: "from-rose-500 to-pink-700",
    text: "The 3D molecular models for Organic Chemistry are absolutely unreal. I finally understood stereoisomers visually instead of just memorizing them. And the streak system kept me disciplined every single day. 720 wouldn't have happened without PhoenixLearn.",
    stars: 5,
  },
  {
    name: "Rohan Mehta",
    role: "CS Undergrad — Top Coder, 1700+ Rating",
    avatar: "RM",
    avatarGrad: "from-violet-500 to-purple-700",
    text: "The Contests feature is elite. Real-time ratings, national leaderboards, and editorial solutions after every round. I've gone from a complete beginner to solving Division 2 problems consistently in four months.",
    stars: 5,
  },
];

function TestimonialCard({ t, idx }: { t: (typeof TESTIMONIALS)[0]; idx: number }) {
  return (
    <FadeSection delay={idx * 0.15}>
      <div className="relative flex flex-col h-full p-7 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-orange-800/30 transition-all duration-500 group hover:bg-white/[0.04]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-700/30 to-transparent" />
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: t.stars }).map((_, i) => (
            <svg key={i} viewBox="0 0 20 20" fill="#F97316" className="w-4 h-4">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        {/* Quote mark */}
        <div className="text-5xl font-serif text-orange-900/40 leading-none mb-2 select-none">"</div>
        <p className="text-zinc-300 leading-relaxed text-sm flex-1 -mt-3">{t.text}</p>
        <div className="mt-6 flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white bg-gradient-to-br flex-shrink-0", t.avatarGrad)}>
            {t.avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.name}</p>
            <p className="text-xs text-zinc-500">{t.role}</p>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}

function Testimonials() {
  return (
    <section className="relative py-28 px-4 bg-[#060100]">
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <SectionHeading
            badge="Stories"
            title={<>Students Who <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#F97316,#FCD34D)" }}>Rose</span></>}
            subtitle="Real results from real students who trusted PhoenixLearn with their dreams."
          />
        </FadeSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <TestimonialCard key={t.name} t={t} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA SECTION
   ============================================================ */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-4 overflow-hidden bg-[#080200]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-700/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-red-600/10 blur-[80px]" />
      </div>
      <EmberParticles count={35} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Mini phoenix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PhoenixSVG className="w-28 h-32 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GradientBadge>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Your Transformation Awaits
          </GradientBadge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-6 text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-white"
        >
          Ready to{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #FDE68A, #F97316, #DC2626)" }}
          >
            Rise?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-5 text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed"
        >
          Join 50,000+ students who chose PhoenixLearn to conquer their exams. Start free. No credit card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/auth"
            className="relative group inline-flex items-center gap-2.5 px-10 py-4 rounded-xl font-black text-base tracking-wide text-white overflow-hidden"
            style={{ background: "linear-gradient(135deg, #F97316, #DC2626)" }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>Start for Free</span>
            <span className="absolute inset-0 rounded-xl ring-2 ring-orange-400/30" />
          </Link>
          <p className="text-xs text-zinc-600 sm:hidden">Free forever plan available</p>
          <p className="hidden sm:block text-xs text-zinc-600">✓ Free forever plan &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
const FOOTER_LINKS = {
  Platform: [
    { label: "AI Copilot", href: "/copilot" },
    { label: "Phoenix Path", href: "/learn" },
    { label: "Knowledge Map", href: "/knowledge-map" },
    { label: "3D Notes", href: "/notes" },
    { label: "Mock Tests", href: "/quiz" },
  ],
  Compete: [
    { label: "National Contests", href: "/contest" },
    { label: "Leaderboard", href: "/contest" },
    { label: "Simulations", href: "/simulations" },
    { label: "Streak System", href: "/dashboard" },
  ],
  Subjects: [
    { label: "Mathematics", href: "/subjects" },
    { label: "Physics", href: "/subjects" },
    { label: "Chemistry", href: "/subjects" },
    { label: "Biology", href: "/subjects" },
    { label: "Computer Science", href: "/subjects" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

function Footer() {
  return (
    <footer className="relative bg-[#040100] border-t border-orange-950/40 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <PhoenixSVG className="w-9 h-10" />
              <span className="text-xl font-black tracking-tight">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#F97316,#FCD34D)" }}>Phoenix</span>
                <span className="text-white">Learn</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-52">
              Rise through knowledge. A next-gen adaptive learning platform for competitive exam aspirants.
            </p>
            <div className="mt-5 flex gap-3">
              {["𝕏", "in", "yt", "ig"].map((social) => (
                <a key={social} href="#"
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs text-zinc-500 hover:text-orange-400 hover:border-orange-800/40 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-black tracking-widest uppercase text-zinc-500 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-zinc-600 hover:text-orange-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-orange-950/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} PhoenixLearn. All rights reserved.
          </p>
          <p className="text-xs text-zinc-800 flex items-center gap-1.5">
            <span className="text-orange-700">🔥</span> Built for those who dare to rise.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#0A0200]/90 backdrop-blur-xl border-b border-orange-950/40 shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <PhoenixSVG className="w-7 h-8" />
          <span className="text-lg font-black tracking-tight">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#F97316,#FCD34D)" }}>Phoenix</span>
            <span className="text-white">Learn</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Features", href: "#" },
            { label: "Subjects", href: "/subjects" },
            { label: "Contests", href: "/contest" },
            { label: "Copilot", href: "/copilot" },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium px-3 py-1.5">
            Sign In
          </Link>
          <Link
            href="/auth"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #EA580C, #DC2626)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={cn("block w-5 h-0.5 bg-zinc-400 transition-all", mobileOpen && "rotate-45 translate-y-2")} />
          <span className={cn("block w-5 h-0.5 bg-zinc-400 transition-all", mobileOpen && "opacity-0")} />
          <span className={cn("block w-5 h-0.5 bg-zinc-400 transition-all", mobileOpen && "-rotate-45 -translate-y-2")} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#0A0200]/95 backdrop-blur-xl border-b border-orange-950/40"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {["Features", "Subjects", "Contests", "Copilot"].map((label) => (
                <Link key={label} href="#"
                  className="px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  {label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-2">
                <Link href="/auth" className="px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/auth"
                  className="px-4 py-3 rounded-xl font-bold text-sm text-white text-center"
                  style={{ background: "linear-gradient(135deg, #EA580C, #DC2626)" }}
                  onClick={() => setMobileOpen(false)}>
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ============================================================
   HOME PAGE — default export
   ============================================================ */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080200] text-white antialiased">
      <Navbar />
      <Hero />
      <Marquee />
      <HowItWorks />
      <FeaturesGrid />
      <SubjectsShowcase />
      <StatsBar />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
