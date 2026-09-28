// ─────────────────────────────────────────────
//  PhoenixLearn – Utility Functions
// ─────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Tailwind Class Merger ─────────────────────

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * Combines clsx for conditional classes + tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── Date Formatting ───────────────────────────

/**
 * Formats a Date object into a human-readable string.
 * e.g. "28 Sep 2026" or "Today", "Yesterday"
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a Date object to a short time string.
 * e.g. "3:45 PM"
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Returns a relative timestamp string.
 * e.g. "2 minutes ago", "3 hours ago"
 */
export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

// ── XP & Leveling ─────────────────────────────

/**
 * Returns the total XP required to reach a given level.
 * Uses a quadratic progression: level 1 = 0, level 2 = 100, level 10 = 4500
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  // Formula: XP = 50 * (level - 1)^2 + 50 * (level - 1)
  return 50 * (level - 1) * (level - 1) + 50 * (level - 1);
}

/**
 * Derives the player level from total accumulated XP.
 * Iterates until XP threshold is exceeded.
 */
export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

/**
 * Returns XP progress within the current level as a percentage (0–100).
 */
export function getXPProgressPercent(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const progress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(Math.round(progress), 0), 100);
}

/**
 * Returns XP remaining to reach next level.
 */
export function getXPToNextLevel(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  const nextLevelXP = getXPForLevel(level + 1);
  return nextLevelXP - totalXP;
}

// ── Difficulty Styling ────────────────────────

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22c55e',    // green-500
  medium: '#f59e0b',  // amber-500
  hard: '#ef4444',    // red-500
  jee: '#8b5cf6',     // violet-500
};

const DIFFICULTY_BG_CLASSES: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  jee: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

/**
 * Returns the hex color for a difficulty level string.
 */
export function getDifficultyColor(difficulty: string): string {
  return DIFFICULTY_COLORS[difficulty.toLowerCase()] ?? '#6b7280';
}

/**
 * Returns Tailwind CSS classes for a difficulty badge.
 */
export function getDifficultyBadgeClass(difficulty: string): string {
  return DIFFICULTY_BG_CLASSES[difficulty.toLowerCase()] ?? 'bg-gray-500/20 text-gray-400';
}

// ── Subject Styling ───────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  math: '#6366f1',        // indigo
  mathematics: '#6366f1',
  physics: '#3b82f6',     // blue
  chemistry: '#10b981',   // emerald
  biology: '#84cc16',     // lime
  cs: '#f59e0b',          // amber
  'computer-science': '#f59e0b',
  coding: '#f59e0b',
  english: '#ec4899',     // pink
  default: '#8b5cf6',     // violet
};

const SUBJECT_GRADIENTS: Record<string, string> = {
  math: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  mathematics: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  physics: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  chemistry: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
  biology: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)',
  cs: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  'computer-science': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  coding: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  english: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
  default: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
};

/**
 * Returns the primary hex color for a given subject ID.
 */
export function getSubjectColor(subjectId: string): string {
  const key = subjectId.toLowerCase();
  return SUBJECT_COLORS[key] ?? SUBJECT_COLORS.default;
}

/**
 * Returns the CSS gradient string for a given subject ID.
 */
export function getSubjectGradient(subjectId: string): string {
  const key = subjectId.toLowerCase();
  return SUBJECT_GRADIENTS[key] ?? SUBJECT_GRADIENTS.default;
}

// ── Duration Formatting ───────────────────────

/**
 * Formats a duration in seconds to a human-readable string.
 * e.g. 3661 → "1h 1m 1s"  |  90 → "1m 30s"  |  45 → "45s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ');
}

/**
 * Formats minutes into a compact readable string.
 * e.g. 90 → "1h 30m"  |  45 → "45m"
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ── ID Generation ─────────────────────────────

/**
 * Generates a cryptographically unique UUID v4 string.
 * Falls back to Math.random for environments without crypto.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ── Gamification ──────────────────────────────

/**
 * Calculates the XP streak bonus multiplier.
 * Streak 1–6 days → 1.0x | 7–13 → 1.25x | 14–29 → 1.5x | 30+ → 2.0x
 * Returns the bonus XP to ADD (not the multiplier itself).
 */
export function calculateStreakBonus(streak: number): number {
  if (streak < 1) return 0;
  if (streak < 7) return 0;           // No bonus in first week
  if (streak < 14) return 25;         // +25 XP per day (week 2)
  if (streak < 30) return 50;         // +50 XP per day (weeks 3–4)
  if (streak < 60) return 75;         // +75 XP per day (month 2)
  return 100;                          // +100 XP per day (2+ months)
}

/**
 * Calculates a streak multiplier for display (e.g. "2.0x").
 */
export function getStreakMultiplier(streak: number): number {
  if (streak < 7) return 1.0;
  if (streak < 14) return 1.25;
  if (streak < 30) return 1.5;
  if (streak < 60) return 1.75;
  return 2.0;
}

// ── Text Utilities ────────────────────────────

/**
 * Truncates a string to a maximum length, appending "…" if needed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/**
 * Converts a camelCase or PascalCase string to "Title Case With Spaces".
 */
export function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/**
 * Converts a slug string to title case.
 * e.g. "modern-physics" → "Modern Physics"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalises a string to a URL-safe slug.
 * e.g. "Modern Physics!" → "modern-physics"
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ── Functional Utilities ──────────────────────

/**
 * Classic debounce – delays invoking `fn` until after `delay` ms of inactivity.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}

/**
 * Classic throttle – invokes `fn` at most once every `limit` ms.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Returns a promise that resolves after `ms` milliseconds.
 * Usage: await sleep(500);
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Math / Stats ──────────────────────────────

/**
 * Clamps a number between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another.
 * e.g. mapRange(5, 0, 10, 0, 100) → 50
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array in-place using Fisher-Yates algorithm and returns it.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Calculates the percentage of correct answers.
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// ── Storage Helpers ───────────────────────────

/**
 * Safely sets an item in localStorage (handles SSR and quota errors).
 */
export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely gets and parses an item from localStorage.
 */
export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

// ── Colour Utilities ──────────────────────────

/**
 * Converts a hex colour string to an RGB object.
 * e.g. "#6366f1" → { r: 99, g: 102, b: 241 }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Returns an rgba() CSS colour string from a hex + alpha.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
}

// ── Validation Helpers ────────────────────────

/**
 * Returns true if the value is a valid email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Returns true if the value is a valid 10-digit Indian mobile number.
 */
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}
