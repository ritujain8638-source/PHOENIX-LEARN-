'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: string;
  name: string;
  subject: 'math' | 'physics' | 'chemistry' | 'bio' | 'cs';
  chapter: string;
  x: number;
  y: number;
  mastery: number; // 0 - 100
  isWeakGap?: boolean;
}

interface Connection {
  from: string;
  to: string;
}

export default function KnowledgeMapPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);

  const nodes: Node[] = [
    // Mathematics
    { id: 'm-sets', name: 'Sets & Relations', subject: 'math', chapter: 'Algebra', x: 200, y: 150, mastery: 85 },
    { id: 'm-quad', name: 'Quadratic Equations', subject: 'math', chapter: 'Algebra', x: 350, y: 180, mastery: 90 },
    { id: 'm-complex', name: 'Complex Numbers', subject: 'math', chapter: 'Algebra', x: 500, y: 140, mastery: 42, isWeakGap: true },
    { id: 'm-limits', name: 'Limits & Continuity', subject: 'math', chapter: 'Calculus', x: 380, y: 320, mastery: 78 },
    { id: 'm-derivatives', name: 'Differentiation', subject: 'math', chapter: 'Calculus', x: 520, y: 350, mastery: 65 },
    { id: 'm-integrals', name: 'Definite Integrals', subject: 'math', chapter: 'Calculus', x: 680, y: 380, mastery: 35, isWeakGap: true },

    // Physics
    { id: 'p-kinematics', name: 'Kinematics 1D & 2D', subject: 'physics', chapter: 'Mechanics', x: 220, y: 480, mastery: 92 },
    { id: 'p-newton', name: 'Newton\'s Laws', subject: 'physics', chapter: 'Mechanics', x: 380, y: 520, mastery: 88 },
    { id: 'p-work', name: 'Work, Energy & Power', subject: 'physics', chapter: 'Mechanics', x: 540, y: 560, mastery: 74 },
    { id: 'p-shm', name: 'Simple Harmonic Motion', subject: 'physics', chapter: 'Oscillations', x: 690, y: 530, mastery: 48, isWeakGap: true },

    // Chemistry
    { id: 'c-mole', name: 'Mole Concept', subject: 'chemistry', chapter: 'Physical', x: 200, y: 700, mastery: 95 },
    { id: 'c-atom', name: 'Atomic Structure & Quantum', subject: 'chemistry', chapter: 'Physical', x: 360, y: 720, mastery: 80 },
    { id: 'c-thermo', name: 'Thermodynamics & ΔG', subject: 'chemistry', chapter: 'Physical', x: 530, y: 750, mastery: 30, isWeakGap: true },

    // Computer Science
    { id: 'cs-algo', name: 'Sorting & Binary Search', subject: 'cs', chapter: 'DSA', x: 750, y: 220, mastery: 85 },
    { id: 'cs-trees', name: 'Trees & Graphs', subject: 'cs', chapter: 'DSA', x: 880, y: 260, mastery: 55 }
  ];

  const connections: Connection[] = [
    { from: 'm-sets', to: 'm-quad' },
    { from: 'm-quad', to: 'm-complex' },
    { from: 'm-quad', to: 'm-limits' },
    { from: 'm-limits', to: 'm-derivatives' },
    { from: 'm-derivatives', to: 'm-integrals' },
    { from: 'm-derivatives', to: 'p-kinematics' },
    { from: 'p-kinematics', to: 'p-newton' },
    { from: 'p-newton', to: 'p-work' },
    { from: 'p-work', to: 'p-shm' },
    { from: 'c-mole', to: 'c-atom' },
    { from: 'c-atom', to: 'c-thermo' },
    { from: 'm-quad', to: 'cs-algo' },
    { from: 'cs-algo', to: 'cs-trees' }
  ];

  const getSubjectColor = (subj: string) => {
    switch (subj) {
      case 'math': return '#ff6b35';
      case 'physics': return '#0a84ff';
      case 'chemistry': return '#30d158';
      case 'bio': return '#bf5af2';
      case 'cs': return '#32ade6';
      default: return '#ff6b35';
    }
  };

  const filteredNodes = selectedSubject === 'all'
    ? nodes
    : nodes.filter((n) => n.subject === selectedSubject);

  return (
    <div className="relative w-screen h-screen bg-void text-white overflow-hidden select-none">
      {/* HUD Header */}
      <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 backdrop-blur-xl transition-colors shadow-lg"
          >
            ← Back
          </Link>
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-lg">
            <h1 className="text-sm md:text-base font-extrabold text-white flex items-center gap-2">
              <span className="text-orange-400">🕸️</span> 3D Knowledge Synapse Map
            </h1>
            <p className="text-[10px] font-mono text-zinc-400">
              Interactive concept constellation showing mastery and learning gaps.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pointer-events-auto flex gap-1.5 p-1 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl shadow-lg">
          {[
            { id: 'all', label: 'All Subjects' },
            { id: 'math', label: 'Math' },
            { id: 'physics', label: 'Physics' },
            { id: 'chemistry', label: 'Chemistry' },
            { id: 'cs', label: 'Coding' }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedSubject === sub.id
                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(255,107,53,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </header>

      {/* Zoom / Viewport Controls */}
      <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-2 p-1.5 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm"
        >
          -
        </button>
        <button
          onClick={() => setZoom(1)}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-mono text-[10px]"
        >
          1x
        </button>
      </div>

      {/* SVG Canvas for 3D Synapse Network */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center">
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-[1100px] h-[900px]"
        >
          <svg className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff9500" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connecting lines */}
            {connections.map((conn, idx) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isHighlighted =
                activeNode && (activeNode.id === conn.from || activeNode.id === conn.to);

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? '#ff6b35' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isHighlighted ? '6,4' : 'none'}
                  className={isHighlighted ? 'animate-pulse' : ''}
                />
              );
            })}

            {/* Node Render */}
            {filteredNodes.map((node) => {
              const isSelected = activeNode?.id === node.id;
              const color = getSubjectColor(node.subject);

              return (
                <g
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulsating beacon for weak knowledge gaps */}
                  {node.isWeakGap && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={36}
                      fill="none"
                      stroke="#ff2d55"
                      strokeWidth={1.5}
                      opacity={0.6}
                      className="animate-ping"
                    />
                  )}

                  {/* Node Glow Backdrop */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 26 : 20}
                    fill={color}
                    opacity={isSelected ? 0.35 : 0.15}
                    className="transition-all duration-300"
                  />

                  {/* Core Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 16 : 12}
                    fill="#111118"
                    stroke={node.isWeakGap ? '#ff2d55' : color}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,107,53,0.5)]"
                  />

                  {/* Node Title Label */}
                  <text
                    x={node.x}
                    y={node.y + 28}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#a1a1aa'}
                    fontSize={11}
                    fontFamily="monospace"
                    className="font-bold pointer-events-none transition-colors"
                  >
                    {node.name}
                  </text>

                  {/* Mastery % Badge */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={node.isWeakGap ? '#ff2d55' : '#fff'}
                    fontSize={9}
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {node.mastery}%
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Node Inspector Drawer */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-20 right-6 z-40 w-80 p-6 rounded-2xl bg-zinc-950/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-start pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-500/20">
                  {activeNode.chapter}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{activeNode.name}</h3>
              </div>
              <button
                onClick={() => setActiveNode(null)}
                className="text-zinc-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Concept Mastery</span>
                <span className={activeNode.isWeakGap ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                  {activeNode.mastery}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    activeNode.isWeakGap ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-amber-400'
                  }`}
                  style={{ width: `${activeNode.mastery}%` }}
                />
              </div>
            </div>

            {activeNode.isWeakGap && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-200">
                ⚠️ <strong>Identified Knowledge Gap:</strong> Phoenix detected that recent quiz responses on this topic showed confusion in formula application.
              </div>
            )}

            <Link
              href={`/learn/${activeNode.id}`}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs text-center block transition-all shadow-[0_0_20px_rgba(255,107,53,0.5)]"
            >
              Study Topic & Fill Gap →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
