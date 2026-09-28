/**
 * useStreak.ts
 * Streak management hook for PhoenixLearn.
 * Reads/writes streak data from localStorage and can sync with Supabase.
 */

"use client";

import { useState, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StreakData {
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null; // ISO date string (date only: YYYY-MM-DD)
}

export interface UseStreakReturn extends StreakData {
  checkAndUpdateStreak: () => Promise<StreakData>;
  getStreakMessage: () => string;
  isStreakAtRisk: () => boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "phoenix-learn-streak";

/** Number of hours before midnight after which the streak is considered "at risk". */
const AT_RISK_HOURS_BEFORE_MIDNIGHT = 3;

// ---------------------------------------------------------------------------
// Motivational messages keyed by streak milestone bands
// ---------------------------------------------------------------------------

type StreakBand =
  | "zero"
  | "first"
  | "building"
  | "week"
  | "twoWeeks"
  | "month"
  | "champion";

const STREAK_MESSAGES: Record<StreakBand, string[]> = {
  zero: [
    "Every expert was once a beginner. Start your streak today! 🌱",
    "Day 1 begins now. The phoenix always rises! 🦅",
    "No streak yet — but that changes today! 🔥",
  ],
  first: [
    "Day 1 complete! The fire has been lit! 🔥",
    "You showed up! That's everything. Keep it going! ✨",
    "First day done! The journey of a thousand lessons starts here. 🚀",
  ],
  building: [
    "🔥 {streak} days strong! The habit is forming!",
    "Look at you go — {streak} days in a row! Keep the fire alive! 🦅",
    "{streak} day streak! Consistency is your superpower! ⚡",
  ],
  week: [
    "One week streak! 🏆 You're officially a dedicated learner!",
    "7 days of learning — you're building something remarkable! 🌟",
    "A full week! The phoenix burns bright! 🔥🦅",
  ],
  twoWeeks: [
    "Two weeks straight! 🎉 Most people quit by now — you didn't!",
    "{streak} days! You're in rare company. Keep soaring! 🚀",
    "Half a month of daily learning! You're unstoppable! 💪",
  ],
  month: [
    "30 days! 🏅 A month of dedication — you've transformed your mindset!",
    "{streak} day streak! You're a learning machine! 🤖🔥",
    "One month strong! The phoenix has fully risen! 🦅✨",
  ],
  champion: [
    "{streak} days! You're a PhoenixLearn Champion! 👑🔥",
    "Legendary — {streak} consecutive days of learning! 🌟🏆",
    "{streak} days and counting. Nothing can stop you now! 🚀🦅",
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns today's date as a YYYY-MM-DD string in local time. */
function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Returns yesterday's date as a YYYY-MM-DD string in local time. */
function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Picks a random element from an array. */
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Selects the correct message band for a given streak count. */
function getBand(streak: number): StreakBand {
  if (streak === 0) return "zero";
  if (streak === 1) return "first";
  if (streak < 7) return "building";
  if (streak === 7) return "week";
  if (streak < 14) return "building";
  if (streak < 30) return "twoWeeks";
  if (streak === 30) return "month";
  return "champion";
}

/** Reads streak data from localStorage. Returns defaults if not found. */
function readFromStorage(): StreakData {
  if (typeof window === "undefined") {
    return { streak: 0, longestStreak: 0, lastActiveDate: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { streak: 0, longestStreak: 0, lastActiveDate: null };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { streak: 0, longestStreak: 0, lastActiveDate: null };
  }
}

/** Writes streak data to localStorage. */
function writeToStorage(data: StreakData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Quota exceeded or private browsing — silently fail
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useStreak()
 *
 * Manages the user's daily learning streak. Call `checkAndUpdateStreak()`
 * on login / on app focus to advance or reset the streak based on the last
 * active date.
 *
 * ```ts
 * const { streak, checkAndUpdateStreak, getStreakMessage, isStreakAtRisk } = useStreak();
 * ```
 */
export function useStreak(): UseStreakReturn {
  const [streakData, setStreakData] = useState<StreakData>(() =>
    readFromStorage()
  );

  // Keep state in sync with localStorage on first hydration
  useEffect(() => {
    setStreakData(readFromStorage());
  }, []);

  // ── checkAndUpdateStreak ──────────────────────────────────────────────────

  /**
   * Determines whether to:
   * - **Continue** the streak (last active was yesterday → increment)
   * - **Maintain** the streak (last active was today → no change)
   * - **Reset**    the streak (last active was 2+ days ago → back to 1)
   * - **Start**    the streak (no prior record → set to 1)
   *
   * Persists the result to localStorage and optionally syncs to Supabase.
   * Returns the updated StreakData.
   */
  const checkAndUpdateStreak = useCallback(async (): Promise<StreakData> => {
    const stored = readFromStorage();
    const today = todayString();
    const yesterday = yesterdayString();

    let updated: StreakData;

    if (stored.lastActiveDate === today) {
      // Already counted today — no change
      updated = stored;
    } else if (stored.lastActiveDate === yesterday) {
      // Consecutive day — extend streak
      const newStreak = stored.streak + 1;
      updated = {
        streak: newStreak,
        longestStreak: Math.max(newStreak, stored.longestStreak),
        lastActiveDate: today,
      };
    } else if (stored.lastActiveDate === null || stored.lastActiveDate < yesterday) {
      // Gap of ≥2 days or first time — reset to 1
      updated = {
        streak: 1,
        longestStreak: Math.max(1, stored.longestStreak),
        lastActiveDate: today,
      };
    } else {
      updated = stored;
    }

    writeToStorage(updated);
    setStreakData(updated);

    // Optional: sync with Supabase in the background (non-blocking)
    // If the API call fails we still have the local data, so no await.
    try {
      await fetch("/api/streak/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
        // Short timeout so we don't block the UI
        signal: AbortSignal.timeout?.(5000),
      });
    } catch {
      // Network unavailable or endpoint not implemented yet — ignore
    }

    return updated;
  }, []);

  // ── getStreakMessage ──────────────────────────────────────────────────────

  /**
   * Returns a contextual motivational message for the current streak count.
   * The message may contain `{streak}` which is replaced with the actual value.
   */
  const getStreakMessage = useCallback((): string => {
    const { streak } = streakData;
    const band = getBand(streak);
    const template = randomPick(STREAK_MESSAGES[band]);
    return template.replace("{streak}", String(streak));
  }, [streakData]);

  // ── isStreakAtRisk ────────────────────────────────────────────────────────

  /**
   * Returns `true` when:
   * - The user has an active streak (> 0)
   * - They have NOT studied today
   * - It's within `AT_RISK_HOURS_BEFORE_MIDNIGHT` hours of midnight
   *
   * Use this to show a "Don't break your streak!" warning.
   */
  const isStreakAtRisk = useCallback((): boolean => {
    const { streak, lastActiveDate } = streakData;
    if (streak === 0) return false; // No streak to protect

    const today = todayString();
    if (lastActiveDate === today) return false; // Already studied today

    // Check how close we are to midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const hoursUntilMidnight =
      (midnight.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilMidnight <= AT_RISK_HOURS_BEFORE_MIDNIGHT;
  }, [streakData]);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    streak: streakData.streak,
    longestStreak: streakData.longestStreak,
    lastActiveDate: streakData.lastActiveDate,
    checkAndUpdateStreak,
    getStreakMessage,
    isStreakAtRisk,
  };
}

export default useStreak;
