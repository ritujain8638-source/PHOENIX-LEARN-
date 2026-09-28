'use client';

import React, { useRef, useState, useCallback } from 'react';
import PhoenixSVG from './PhoenixSVG';

/* ─────────────────────────────────────────────────
   Types
───────────────────────────────────────────────── */
export interface PhoenixLevel {
  id: number;
  title: string;
  description?: string;
  xpRequired: number;
  xpReward: number;
  reward?: string;
  topics: string[];
  icon?: string;          // emoji icon representing the unlock
  status: 'completed' | 'current' | 'locked';
  subject?: string;
}

interface LevelPopup {
  level: PhoenixLevel;
  x: number;
  y: number;
}

interface PhoenixPathProps {
  currentLevel: number;
  levels: PhoenixLevel[];
  onLevelClick?: (level: PhoenixLevel) => void;
}

/* ─────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────── */
const NODE_RADIUS = 36;
const NODE_SPACING_X = 160;
const PATH_HEIGHT = 300;
const WAVE_AMPLITUDE = 90;

/* vertical offset follows a sine wave to create the winding path */
function yForIndex(i: number): number {
  return PATH_HEIGHT / 2 + Math.sin((i * Math.PI) / 2.5) * WAVE_AMPLITUDE;
}

/* ─────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────── */
const LockIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" fill="#6b7280" />
    <path d="M8 11V7a4 4 0 018 0v4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#f59e0b" />
    <path d="M7 12l4 4 6-6" stroke="#1a0a00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────────────
   Level Popup
───────────────────────────────────────────────── */
interface LevelPopupCardProps {
  popup: LevelPopup;
  onClose: () => void;
  onSelect: (level: PhoenixLevel) => void;
}

const LevelPopupCard: React.FC<LevelPopupCardProps> = ({ popup, onClose, onSelect }) => {
  const { level } = popup;
  const statusColors: Record<PhoenixLevel['status'], string> = {
    completed: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    current: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    locked: 'text-gray-500 border-gray-600/40 bg-gray-700/30',
  };
  const statusLabels: Record<PhoenixLevel['status'], string> = {
    completed: '✅ Completed',
    current: '🔥 In Progress',
    locked: '🔒 Locked',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Card */}
      <div
        className="absolute z-50 w-72 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-5"
        style={{
          top: popup.y - 10,
          left: popup.x,
          transform: 'translate(-50%, -100%)',
          backdropFilter: 'blur(12px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Level ${level.id}: ${level.title}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{level.icon ?? '⭐'}</span>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Level {level.id}</p>
              <h3 className="text-base font-bold text-white">{level.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close popup"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Status badge */}
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border mb-3 ${statusColors[level.status]}`}>
          {statusLabels[level.status]}
        </span>

        {/* Description */}
        {level.description && (
          <p className="text-sm text-gray-400 mb-3">{level.description}</p>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/5 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-500">XP Required</p>
            <p className="text-sm font-bold text-white">{level.xpRequired.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-500">XP Reward</p>
            <p className="text-sm font-bold text-yellow-400">+{level.xpReward.toLocaleString()}</p>
          </div>
        </div>

        {/* Reward */}
        {level.reward && (
          <div className="flex items-center gap-2 mb-3 bg-orange-500/10 border border-orange-500/20 rounded-xl p-2">
            <span className="text-lg">🎁</span>
            <div>
              <p className="text-xs text-gray-500">Unlock Reward</p>
              <p className="text-sm font-semibold text-orange-300">{level.reward}</p>
            </div>
          </div>
        )}

        {/* Topics */}
        {level.topics.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Topics Covered</p>
            <div className="flex flex-wrap gap-1.5">
              {level.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs bg-white/5 border border-white/10 text-gray-300 rounded-full px-2 py-0.5"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {level.status !== 'locked' && (
          <button
            onClick={() => onSelect(level)}
            className={`
              w-full py-2 rounded-xl text-sm font-bold transition-all duration-200
              ${level.status === 'completed'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30'
                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 shadow-lg'
              }
            `}
          >
            {level.status === 'completed' ? 'Review Level' : 'Start Level 🔥'}
          </button>
        )}
        {level.status === 'locked' && (
          <p className="text-xs text-center text-gray-600 mt-1">
            Reach {level.xpRequired.toLocaleString()} XP to unlock
          </p>
        )}

        {/* Arrow pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 w-0 h-0"
          style={{
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid rgb(17,24,39)',
          }}
        />
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Main PhoenixPath component
───────────────────────────────────────────────── */
const PhoenixPath: React.FC<PhoenixPathProps> = ({
  currentLevel,
  levels,
  onLevelClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<LevelPopup | null>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const totalWidth = (levels.length - 1) * NODE_SPACING_X + 120;

  /* Build the SVG path string (curved bezier between nodes) */
  const buildPath = (): string => {
    if (levels.length < 2) return '';
    const points = levels.map((_, i) => ({
      x: 60 + i * NODE_SPACING_X,
      y: yForIndex(i),
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cp1x = points[i].x + NODE_SPACING_X / 2;
      const cp1y = points[i].y;
      const cp2x = points[i + 1].x - NODE_SPACING_X / 2;
      const cp2y = points[i + 1].y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
    }
    return d;
  };

  const handleNodeClick = useCallback(
    (level: PhoenixLevel, idx: number) => {
      const btn = nodeRefs.current[idx];
      if (!btn || !scrollRef.current) return;
      const containerRect = scrollRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const x = btnRect.left + btnRect.width / 2 - containerRect.left + scrollRef.current.scrollLeft;
      const y = btnRect.top - containerRect.top + scrollRef.current.scrollTop;

      if (popup?.level.id === level.id) {
        setPopup(null);
      } else {
        setPopup({ level, x, y });
        onLevelClick?.(level);
      }
    },
    [popup, onLevelClick]
  );

  const pathD = buildPath();
  /* Compute how far along the path is "completed" */
  const completedCount = levels.filter((l) => l.status === 'completed').length;

  return (
    <>
      <style>{`
        @keyframes node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,146,60,0.7), 0 0 20px rgba(251,146,60,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(251,146,60,0), 0 0 30px rgba(251,146,60,0.6); }
        }
        @keyframes path-shimmer {
          0%   { stroke-dashoffset: 1200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes phoenix-sit-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        .current-node-pulse {
          animation: node-pulse 2s ease-in-out infinite;
        }
        .path-draw {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: path-shimmer 1.8s ease forwards;
        }
        .phoenix-sit-bob {
          animation: phoenix-sit-bob 2.8s ease-in-out infinite;
        }
        .level-node-btn:hover .node-icon {
          transform: scale(1.15);
        }
        .node-icon {
          transition: transform 0.2s ease;
        }
      `}</style>

      <div className="relative w-full select-none">
        {/* ── Legend ── */}
        <div className="flex items-center gap-6 mb-4 px-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-red-600 ring-2 ring-orange-400" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 ring-2 ring-yellow-400/50" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-700 ring-2 ring-gray-600/50" />
            <span>Locked</span>
          </div>
        </div>

        {/* ── Scrollable container ── */}
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-visible pb-6 relative"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* SVG path backdrop */}
          <svg
            width={totalWidth}
            height={PATH_HEIGHT}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="completedPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="lockedPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              <filter id="pathGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ghost / locked path */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#lockedPathGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10 8"
              opacity="0.35"
            />

            {/* Completed + current path segment */}
            {completedCount > 0 && (() => {
              const pts = levels.map((_, i) => ({
                x: 60 + i * NODE_SPACING_X,
                y: yForIndex(i),
              }));
              let partialD = `M ${pts[0].x} ${pts[0].y}`;
              const count = Math.min(completedCount, pts.length - 1);
              for (let i = 0; i < count; i++) {
                const cp1x = pts[i].x + NODE_SPACING_X / 2;
                const cp1y = pts[i].y;
                const cp2x = pts[i + 1].x - NODE_SPACING_X / 2;
                const cp2y = pts[i + 1].y;
                partialD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
              }
              return (
                <path
                  d={partialD}
                  fill="none"
                  stroke="url(#completedPathGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  filter="url(#pathGlow)"
                  className="path-draw"
                />
              );
            })()}
          </svg>

          {/* ── Level nodes ── */}
          <div
            style={{
              width: totalWidth,
              height: PATH_HEIGHT,
              position: 'relative',
            }}
          >
            {levels.map((level, idx) => {
              const cx = 60 + idx * NODE_SPACING_X;
              const cy = yForIndex(idx);
              const isCurrent = level.status === 'current';
              const isCompleted = level.status === 'completed';
              const isLocked = level.status === 'locked';

              return (
                <div
                  key={level.id}
                  style={{
                    position: 'absolute',
                    left: cx - NODE_RADIUS,
                    top: cy - NODE_RADIUS,
                    width: NODE_RADIUS * 2,
                    height: NODE_RADIUS * 2,
                    zIndex: isCurrent ? 10 : 5,
                  }}
                >
                  {/* Phoenix sits on current level (above node) */}
                  {isCurrent && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 phoenix-sit-bob"
                      style={{ bottom: NODE_RADIUS * 2 - 8, zIndex: 20 }}
                    >
                      <PhoenixSVG size={56} animated mood="idle" />
                    </div>
                  )}

                  {/* Node button */}
                  <button
                    ref={(el) => { nodeRefs.current[idx] = el; }}
                    onClick={() => handleNodeClick(level, idx)}
                    disabled={false}
                    className={`
                      level-node-btn
                      w-full h-full rounded-full
                      flex items-center justify-center
                      border-[3px] transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
                      ${isCurrent
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400 current-node-pulse focus:ring-orange-500 cursor-pointer'
                        : isCompleted
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300/60 hover:scale-105 focus:ring-yellow-400 cursor-pointer'
                        : 'bg-gray-800 border-gray-700/60 hover:bg-gray-750 focus:ring-gray-600 cursor-pointer opacity-60'
                      }
                    `}
                    aria-label={`Level ${level.id}: ${level.title} — ${level.status}`}
                  >
                    <span className="node-icon text-xl leading-none">
                      {isCompleted ? (
                        <CheckIcon />
                      ) : isLocked ? (
                        <LockIcon />
                      ) : (
                        level.icon ?? '🔥'
                      )}
                    </span>
                  </button>

                  {/* Level number label */}
                  <div
                    className={`
                      absolute -bottom-6 left-1/2 -translate-x-1/2
                      text-xs font-bold whitespace-nowrap
                      ${isCurrent ? 'text-orange-400' : isCompleted ? 'text-yellow-400' : 'text-gray-600'}
                    `}
                  >
                    Lv {level.id}
                  </div>

                  {/* Level title (small, below number) */}
                  <div
                    className={`
                      absolute -bottom-11 left-1/2 -translate-x-1/2
                      text-[10px] whitespace-nowrap max-w-[120px] truncate text-center
                      ${isCurrent ? 'text-gray-300' : 'text-gray-600'}
                    `}
                  >
                    {level.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Popup ── */}
          {popup && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <div style={{ pointerEvents: 'all' }}>
                <LevelPopupCard
                  popup={popup}
                  onClose={() => setPopup(null)}
                  onSelect={(level) => {
                    setPopup(null);
                    onLevelClick?.(level);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom progress summary ── */}
        <div className="flex items-center justify-between mt-8 px-2">
          <div className="text-sm text-gray-500">
            <span className="text-white font-semibold">{completedCount}</span> / {levels.length} levels completed
          </div>
          <div className="h-2 flex-1 mx-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
              style={{
                width: `${levels.length > 0 ? (completedCount / levels.length) * 100 : 0}%`,
                boxShadow: '0 0 8px rgba(251,146,60,0.6)',
              }}
            />
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-orange-400 font-semibold">
              {Math.round(levels.length > 0 ? (completedCount / levels.length) * 100 : 0)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoenixPath;
