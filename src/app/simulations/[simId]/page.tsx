'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SimulationViewerPage() {
  // Parameters
  const [length, setLength] = useState(2.0); // meters
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [initialAngle, setInitialAngle] = useState(30); // degrees
  const [isPlaying, setIsPlaying] = useState(true);

  const [time, setTime] = useState(0);

  // Animation loop
  useEffect(() => {
    let animId: number;
    let lastStamp = performance.now();

    const loop = (stamp: number) => {
      const dt = (stamp - lastStamp) / 1000;
      lastStamp = stamp;
      if (isPlaying) {
        setTime((t) => t + dt);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Physics formulas
  // Period T = 2 * PI * sqrt(L / g)
  const period = 2 * Math.PI * Math.sqrt(length / gravity);
  const omega = Math.sqrt(gravity / length); // angular frequency
  const thetaRad = (initialAngle * Math.PI) / 180;
  const currentAngleRad = thetaRad * Math.cos(omega * time);
  const currentAngleDeg = (currentAngleRad * 180) / Math.PI;

  // Visual layout for pendulum
  const pivotX = 250;
  const pivotY = 50;
  const visualLength = length * 90; // scale meters to pixels
  const bobX = pivotX + visualLength * Math.sin(currentAngleRad);
  const bobY = pivotY + visualLength * Math.cos(currentAngleRad);

  return (
    <div className="min-h-screen bg-void text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/simulations"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            ← Simulations
          </Link>
          <div>
            <h1 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <span>⚛️</span> Simple Harmonic Motion: The Ideal Pendulum
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-green-500 text-white shadow-[0_0_15px_rgba(48,209,88,0.4)]'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Resume'}
        </button>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Physics Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[460px] w-full rounded-2xl bg-zinc-950/90 border border-white/10 shadow-2xl relative overflow-hidden flex items-center justify-center">
            {/* Grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

            {/* SVG Pendulum Rendering */}
            <svg className="w-full h-full">
              {/* Ceiling support */}
              <rect x={pivotX - 60} y={pivotY - 12} width={120} height={12} fill="#3f3f46" rx={4} />

              {/* Angle arc guide */}
              <path
                d={`M ${pivotX - 50} ${pivotY + 80} A 80 80 0 0 1 ${pivotX + 50} ${pivotY + 80}`}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4,4"
              />

              {/* Equilibrium center line */}
              <line
                x1={pivotX}
                y1={pivotY}
                x2={pivotX}
                y2={pivotY + visualLength + 40}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="3,3"
              />

              {/* String */}
              <line
                x1={pivotX}
                y1={pivotY}
                x2={bobX}
                y2={bobY}
                stroke="#ff6b35"
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Bob */}
              <circle
                cx={bobX}
                cy={bobY}
                r={22}
                fill="url(#bobGlow)"
                stroke="#ff9500"
                strokeWidth={3}
                className="drop-shadow-[0_0_20px_rgba(255,107,53,0.8)]"
              />

              {/* Defs */}
              <defs>
                <radialGradient id="bobGlow" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="40%" stopColor="#ff6b35" />
                  <stop offset="100%" stopColor="#9a3412" />
                </radialGradient>
              </defs>
            </svg>

            {/* Instant Real-Time Telemetry Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md font-mono text-xs space-y-1">
              <div className="text-zinc-400">θ(t): <strong className="text-white">{currentAngleDeg.toFixed(1)}°</strong></div>
              <div className="text-zinc-400">Period T: <strong className="text-amber-400">{period.toFixed(2)}s</strong></div>
              <div className="text-zinc-400">Freq f: <strong className="text-cyan-400">{(1 / period).toFixed(2)} Hz</strong></div>
            </div>
          </div>

          {/* Mathematical Insights Box */}
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>📐</span> Mathematical Governing Equation
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              The restoring torque on the pendulum is τ = -mgL sin(θ). For small angles (sin θ ≈ θ):
              <br />
              d²θ/dt² + (g/L)θ = 0 ⟹ T = 2π √(L/g)
            </p>
          </div>
        </div>

        {/* Physics Control Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-3">
              Experimental Controls
            </h2>

            {/* Length Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">String Length (L)</span>
                <span className="text-orange-400 font-bold">{length.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Gravity Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Gravity Acceleration (g)</span>
                <span className="text-cyan-400 font-bold">{gravity.toFixed(1)} m/s²</span>
              </div>
              <input
                type="range"
                min="1.6"
                max="25.0"
                step="0.2"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex gap-1.5 pt-1">
                {[
                  { label: 'Moon (1.6)', val: 1.6 },
                  { label: 'Earth (9.8)', val: 9.8 },
                  { label: 'Jupiter (24.8)', val: 24.8 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setGravity(preset.val)}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Amplitude Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Initial Amplitude (θ₀)</span>
                <span className="text-amber-400 font-bold">{initialAngle}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={initialAngle}
                onChange={(e) => setInitialAngle(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setLength(2.0);
                setGravity(9.8);
                setInitialAngle(30);
                setTime(0);
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
