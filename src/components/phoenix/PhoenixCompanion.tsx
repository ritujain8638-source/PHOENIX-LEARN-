'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PhoenixSVG from './PhoenixSVG';

type PhoenixMood = 'idle' | 'happy' | 'excited' | 'thinking';

interface Message {
  text: string;
  mood: PhoenixMood;
}

function getGreetingByTime(): Message {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      text: "Good morning! 🌅 The best minds tackle hard problems early. Ready to learn something new?",
      mood: 'happy',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: "Afternoon grind! 💪 A focused session now beats a rushed one later. What are we studying?",
      mood: 'idle',
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      text: "Evening scholar! 🌆 This is prime time for deep learning. Let's make progress together.",
      mood: 'idle',
    };
  } else {
    return {
      text: "Burning the midnight oil? 🔥 Respect. Just don't skip sleep — memory consolidates at night!",
      mood: 'thinking',
    };
  }
}

const ROTATING_MESSAGES: Message[] = [
  { text: "Consistency beats intensity every time. Even 15 minutes a day compounds into mastery. 🧠", mood: 'idle' },
  { text: "You're making great progress! Each concept you learn is a brick in your knowledge palace. 🏛️", mood: 'happy' },
  { text: "Stuck on something? Break it into smaller pieces. Every expert was once a beginner. ✨", mood: 'thinking' },
  { text: "Challenge yourself! Try a harder problem — that's where real growth happens. 🚀", mood: 'excited' },
  { text: "Your streak is your superpower. Don't break the chain! 🔗", mood: 'happy' },
  { text: "Learning is not a race. Deep understanding is worth far more than speed. 🦉", mood: 'thinking' },
  { text: "Ready to level up? Pick a subject and let's dive deep together. 🔥", mood: 'excited' },
];

const INITIAL_MESSAGE: Message = {
  text: "Hey! I'm Phoenix 🔥 Your guide through this learning universe. What shall we conquer today?",
  mood: 'excited',
};

const PhoenixCompanion: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message>(INITIAL_MESSAGE);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  /* ── typewriter effect ── */
  useEffect(() => {
    if (!bubbleOpen) return;
    setIsTyping(true);
    setDisplayedText('');
    const text = currentMessage.text;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [currentMessage, bubbleOpen]);

  /* ── open bubble with greeting after mount ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setBubbleOpen(true);
      setHasGreeted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  /* ── rotate messages every 60s if bubble is open ── */
  useEffect(() => {
    if (!hasGreeted) return;
    const interval = setInterval(() => {
      if (bubbleOpen) {
        const next = ROTATING_MESSAGES[messageIndex % ROTATING_MESSAGES.length];
        setCurrentMessage(next);
        setMessageIndex((p) => p + 1);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [hasGreeted, bubbleOpen, messageIndex]);

  const handlePhoenixClick = useCallback(() => {
    if (!bubbleOpen) {
      /* Reopen with time-appropriate greeting */
      setCurrentMessage(getGreetingByTime());
      setBubbleOpen(true);
      setIsMinimized(false);
    } else {
      setBubbleOpen(false);
    }
  }, [bubbleOpen]);

  const handleCollapse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setBubbleOpen(false);
    setIsMinimized(true);
  }, []);

  const handleMinimizeToggle = useCallback(() => {
    setIsVisible((v) => !v);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={handleMinimizeToggle}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Show Phoenix companion"
      >
        <span className="text-lg">🔥</span>
      </button>
    );
  }

  return (
    <>
      {/* ── Inline styles for keyframe animations ── */}
      <style>{`
        @keyframes phoenix-companion-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes phoenix-bubble-in {
          0%   { opacity: 0; transform: scale(0.85) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0px); }
        }
        @keyframes phoenix-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes phoenix-glow {
          0%, 100% { box-shadow: 0 0 16px 4px rgba(251,146,60,0.4); }
          50%       { box-shadow: 0 0 28px 8px rgba(251,146,60,0.7); }
        }
        .phoenix-companion-float {
          animation: phoenix-companion-float 3.2s ease-in-out infinite;
        }
        .phoenix-companion-bubble {
          animation: phoenix-bubble-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .phoenix-pulse-ring {
          animation: phoenix-pulse-ring 1.8s ease-out infinite;
        }
        .phoenix-companion-glow {
          animation: phoenix-glow 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* ── Speech Bubble ── */}
        {bubbleOpen && (
          <div
            className="phoenix-companion-bubble relative max-w-xs w-72"
            role="dialog"
            aria-live="polite"
          >
            {/* Bubble body */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-orange-500/40 rounded-2xl rounded-br-sm px-4 py-3 shadow-2xl">
              {/* Glow border */}
              <div className="absolute inset-0 rounded-2xl rounded-br-sm bg-gradient-to-br from-orange-500/10 to-red-600/10 pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-400 phoenix-pulse-ring" />
                  <span className="text-xs font-bold text-orange-400 tracking-wider uppercase">
                    Phoenix
                  </span>
                </div>
                <button
                  onClick={handleCollapse}
                  className="text-gray-500 hover:text-gray-300 transition-colors p-0.5 rounded-full hover:bg-white/10"
                  aria-label="Collapse speech bubble"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 5l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Message text */}
              <p className="text-sm text-gray-100 leading-relaxed min-h-[3rem]">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 bg-orange-400 ml-0.5 animate-pulse align-middle" />
                )}
              </p>

              {/* Quick action buttons */}
              {!isTyping && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => {
                      setCurrentMessage({ text: "Great! Let's pick a subject. Which one calls to you? Math, Physics, Chemistry, Biology, or Coding? 🔥", mood: 'excited' });
                    }}
                    className="text-xs bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 border border-orange-500/30 rounded-full px-3 py-1 transition-colors"
                  >
                    Choose Subject
                  </button>
                  <button
                    onClick={() => {
                      setCurrentMessage(ROTATING_MESSAGES[Math.floor(Math.random() * ROTATING_MESSAGES.length)]);
                    }}
                    className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded-full px-3 py-1 transition-colors"
                  >
                    Motivate me
                  </button>
                </div>
              )}

              {/* Triangle pointer */}
              <div
                className="absolute -bottom-2 right-5 w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid rgb(31,41,55)',
                }}
              />
            </div>
          </div>
        )}

        {/* ── Phoenix Icon Button ── */}
        <div className="relative flex items-end justify-end">
          {/* Dismiss button */}
          <button
            onClick={handleMinimizeToggle}
            className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors z-10"
            aria-label="Hide Phoenix companion"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Phoenix avatar */}
          <button
            onClick={handlePhoenixClick}
            className={`
              relative cursor-pointer rounded-full p-1
              bg-gradient-to-br from-gray-900 to-gray-800
              border-2 border-orange-500/60
              phoenix-companion-glow
              hover:border-orange-400
              transition-all duration-300 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-orange-500/50
            `}
            aria-label={bubbleOpen ? 'Close Phoenix speech bubble' : 'Open Phoenix speech bubble'}
          >
            <div className="phoenix-companion-float">
              <PhoenixSVG
                size={80}
                animated
                mood={currentMessage.mood}
              />
            </div>

            {/* Notification dot when bubble is closed */}
            {!bubbleOpen && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <span className="text-[6px] text-white font-bold">!</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PhoenixCompanion;
