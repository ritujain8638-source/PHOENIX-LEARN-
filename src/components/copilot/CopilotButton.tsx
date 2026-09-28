'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CopilotPanel from './CopilotPanel';

// ─── Phoenix Flame Icon ───────────────────────────────────────────────────────

function PhoenixFlame() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C12 2 7.5 6.5 7.5 11C7.5 13.5 8.8 15.6 10.8 16.8L9.5 22H14.5L13.2 16.8C15.2 15.6 16.5 13.5 16.5 11C16.5 6.5 12 2 12 2Z"
        fill="url(#btn-flame-grad)"
      />
      <circle cx="12" cy="10.5" r="2.5" fill="#FFD700" />
      <defs>
        <linearGradient id="btn-flame-grad" x1="7.5" y1="2" x2="16.5" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="60%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#FF2200" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function UnreadBadge({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-[#0d0f14] flex items-center justify-center shadow-lg shadow-red-500/50 z-10"
    >
      <span className="text-white text-[9px] font-bold leading-none px-0.5">
        {count > 9 ? '9+' : count}
      </span>
    </motion.div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 8, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="bg-[#1a1a2e] border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
            AI Copilot
            {/* Arrow */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#1a1a2e]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main CopilotButton ───────────────────────────────────────────────────────

export default function CopilotButton() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2); // simulate 2 initial suggestions
  const [isHovered, setIsHovered] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Prevent SSR mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Simulate new suggestions arriving after 8 seconds
  useEffect(() => {
    if (!hasMounted) return;
    const timer = setTimeout(() => {
      if (!isPanelOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [hasMounted, isPanelOpen]);

  const handleOpen = () => {
    setIsPanelOpen(true);
    setUnreadCount(0); // Clear badge when opening
  };

  const handleClose = () => {
    setIsPanelOpen(false);
  };

  if (!hasMounted) return null;

  return (
    <>
      {/* ── Floating Button ── */}
      <div
        className="fixed bottom-28 right-5 z-40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip visible={isHovered && !isPanelOpen} />

        <motion.button
          onClick={isPanelOpen ? handleClose : handleOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF9500 50%, #FFB800 100%)',
            boxShadow: isPanelOpen
              ? '0 0 0 2px rgba(255,107,0,0.6), 0 8px 32px rgba(255,107,0,0.5)'
              : '0 8px 32px rgba(255,107,0,0.4)',
          }}
          aria-label="Open AI Copilot"
          aria-expanded={isPanelOpen}
        >
          {/* Animated pulsing rings */}
          {!isPanelOpen && (
            <>
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: '2px solid rgba(255,107,0,0.6)' }}
                animate={{ scale: [1, 1.5, 1.5], opacity: [0.8, 0, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: '2px solid rgba(255,150,0,0.4)' }}
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              />
            </>
          )}

          {/* Inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-white/10" />

          {/* Icon */}
          <motion.div
            animate={isPanelOpen ? { rotate: 180, scale: 0.8 } : { rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isPanelOpen ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <PhoenixFlame />
            )}
          </motion.div>

          {/* Label */}
          <AnimatePresence mode="wait">
            {!isPanelOpen && (
              <motion.span
                key="ai-label"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-white font-bold text-[10px] leading-none tracking-wide"
              >
                AI
              </motion.span>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          <AnimatePresence>
            {unreadCount > 0 && !isPanelOpen && (
              <UnreadBadge key="badge" count={unreadCount} />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Active indicator (shown when panel is open) */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Copilot Panel ── */}
      <CopilotPanel
        isOpen={isPanelOpen}
        onClose={handleClose}
        context={{ subject: 'General', topic: '' }}
      />
    </>
  );
}
