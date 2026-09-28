/**
 * usePhoenix.ts
 * Hook for the Phoenix mascot character — visibility, mood, messages, and
 * screen position. Includes auto-greet logic that fires on first mount.
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useCurrentUser } from "./useUser";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PhoenixMood =
  | "happy"
  | "excited"
  | "thinking"
  | "celebrating"
  | "guiding";

export type PhoenixPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "center";

export interface PhoenixState {
  isVisible: boolean;
  mood: PhoenixMood;
  message: string;
  position: PhoenixPosition;
  isSpeaking: boolean; // true while message is being "typed out"
}

export interface PhoenixActions {
  showPhoenix: (mood?: PhoenixMood, position?: PhoenixPosition) => void;
  hidePhoenix: () => void;
  setMood: (mood: PhoenixMood) => void;
  sendMessage: (message: string, mood?: PhoenixMood) => void;
  celebrate: (reason?: string) => void;
  guide: (instruction: string) => void;
  setPosition: (position: PhoenixPosition) => void;
}

export type UsePhoenixReturn = PhoenixState & PhoenixActions;

// ---------------------------------------------------------------------------
// Greeting messages keyed by time-of-day and mood
// ---------------------------------------------------------------------------

const GREETINGS_BY_HOUR: Record<string, string[]> = {
  morning: [
    "Good morning, scholar! Ready to ignite some knowledge? 🌅",
    "Rise and learn! The best time to grow is now. ☀️",
    "Morning! Let's set your brain on fire with some great lessons! 🔥",
  ],
  afternoon: [
    "Good afternoon! How about we keep that learning momentum going? 🚀",
    "Hey there! Ready to conquer the afternoon with some knowledge? ⚡",
    "The afternoon is perfect for deep focus. Let's dive in! 🎯",
  ],
  evening: [
    "Good evening! A little learning before you rest? 🌙",
    "Evening sessions are the best! Let's review what you've learned. ✨",
    "Winding down? Let's do a quick recap before you call it a day! 🦅",
  ],
  night: [
    "Burning the midnight oil? I admire the dedication! 🌟",
    "Late-night learner spotted! Let's make it count. 🦉",
    "Even the stars study at night. Let's go! 💫",
  ],
};

const CELEBRATION_MESSAGES: Record<string, string> = {
  default: "Amazing work! You're on fire! 🔥",
  streak: "Streak maintained! You're unstoppable! 🏆",
  quiz: "Perfect score! You absolutely nailed it! 🎉",
  level: "Level up! The phoenix rises higher! 🦅✨",
  badge: "New badge unlocked! You've earned it! 🏅",
  topic: "Topic completed! Knowledge gained! 📚🔥",
};

const GUIDE_PREFIX = "💡 ";

// ---------------------------------------------------------------------------
// Helper: pick a random item from an array
// ---------------------------------------------------------------------------

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Helper: get current time-of-day bucket
// ---------------------------------------------------------------------------

function getTimeBucket(): keyof typeof GREETINGS_BY_HOUR {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const DEFAULT_STATE: PhoenixState = {
  isVisible: false,
  mood: "happy",
  message: "",
  position: "bottom-right",
  isSpeaking: false,
};

/**
 * usePhoenix()
 *
 * Controls the Phoenix mascot's visibility, mood, spoken messages, and
 * on-screen position. Fires an auto-greet on the first mount.
 *
 * ```tsx
 * const { isVisible, mood, message, celebrate, guide } = usePhoenix();
 * ```
 */
export function usePhoenix(): UsePhoenixReturn {
  const [state, setState] = useState<PhoenixState>(DEFAULT_STATE);
  const user = useCurrentUser();
  const hasGreeted = useRef(false);

  // ── Internal: set state partially ────────────────────────────────────────

  const patch = useCallback((partial: Partial<PhoenixState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  // ── Auto-dismiss isSpeaking after message display time ────────────────────

  const speakingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerSpeaking = useCallback(
    (message: string) => {
      if (speakingTimeout.current) clearTimeout(speakingTimeout.current);
      patch({ message, isSpeaking: true });
      // Allow ~50 ms per character for reading, min 3 s, max 8 s
      const duration = Math.min(8000, Math.max(3000, message.length * 50));
      speakingTimeout.current = setTimeout(() => {
        patch({ isSpeaking: false });
      }, duration);
    },
    [patch]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speakingTimeout.current) clearTimeout(speakingTimeout.current);
    };
  }, []);

  // ── Auto-greet on mount ───────────────────────────────────────────────────

  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;

    const timeBucket = getTimeBucket();
    const greetings = GREETINGS_BY_HOUR[timeBucket];
    let greeting = randomPick(greetings);

    // Personalise if the user object is already loaded
    if (user?.displayName) {
      greeting = `Hey ${user.displayName}! ${greeting}`;
    }

    // Small delay so the UI has settled before Phoenix appears
    const timer = setTimeout(() => {
      setState({
        isVisible: true,
        mood: "happy",
        message: greeting,
        position: "bottom-right",
        isSpeaking: true,
      });

      speakingTimeout.current = setTimeout(() => {
        patch({ isSpeaking: false });
      }, Math.min(8000, Math.max(3000, greeting.length * 50)));
    }, 1200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Makes Phoenix visible, optionally setting mood and position.
   */
  const showPhoenix = useCallback(
    (mood: PhoenixMood = "happy", position: PhoenixPosition = "bottom-right") => {
      patch({ isVisible: true, mood, position });
    },
    [patch]
  );

  /**
   * Hides Phoenix from view.
   */
  const hidePhoenix = useCallback(() => {
    patch({ isVisible: false, isSpeaking: false, message: "" });
    if (speakingTimeout.current) clearTimeout(speakingTimeout.current);
  }, [patch]);

  /**
   * Changes only the mood without affecting visibility or message.
   */
  const setMood = useCallback(
    (mood: PhoenixMood) => {
      patch({ mood });
    },
    [patch]
  );

  /**
   * Sets a new message and optionally changes the mood.
   * Shows Phoenix if currently hidden.
   */
  const sendMessage = useCallback(
    (message: string, mood: PhoenixMood = "happy") => {
      patch({ isVisible: true, mood });
      triggerSpeaking(message);
    },
    [patch, triggerSpeaking]
  );

  /**
   * Triggers a celebration sequence with a contextual message.
   * `reason` maps to one of the predefined celebration keys or "default".
   */
  const celebrate = useCallback(
    (reason: keyof typeof CELEBRATION_MESSAGES | string = "default") => {
      const message =
        CELEBRATION_MESSAGES[reason] ?? CELEBRATION_MESSAGES.default;
      patch({ isVisible: true, mood: "celebrating", position: "bottom-right" });
      triggerSpeaking(message);
    },
    [patch, triggerSpeaking]
  );

  /**
   * Shows Phoenix in "guiding" mood with an instructional message.
   */
  const guide = useCallback(
    (instruction: string) => {
      patch({ isVisible: true, mood: "guiding", position: "bottom-right" });
      triggerSpeaking(`${GUIDE_PREFIX}${instruction}`);
    },
    [patch, triggerSpeaking]
  );

  /**
   * Moves Phoenix to a different screen corner.
   */
  const setPosition = useCallback(
    (position: PhoenixPosition) => {
      patch({ position });
    },
    [patch]
  );

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    ...state,
    showPhoenix,
    hidePhoenix,
    setMood,
    sendMessage,
    celebrate,
    guide,
    setPosition,
  };
}

export default usePhoenix;
