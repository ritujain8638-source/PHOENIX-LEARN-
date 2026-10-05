/**
 * useUser.ts
 * Zustand store + React hook for PhoenixLearn user state management.
 * Persisted to localStorage via zustand/middleware persist.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TopicProgress {
  topicId: string;
  score: number; // 0–100
  completedAt: string; // ISO date string
  attempts: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null; // ISO date string
  joinedAt: string; // ISO date string
  progress: Record<string, TopicProgress>; // keyed by topicId
  badges: string[];
  preferredSubjects: string[];
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface UserActions {
  setUser: (user: User | null) => void;
  logout: () => void;
  updateStreak: (streak: number, longestStreak?: number) => void;
  addXP: (amount: number) => void;
  updateProgress: (topicId: string, score: number) => void;
  setLoading: (loading: boolean) => void;
  updateDisplayName: (name: string) => void;
  updateAvatar: (url: string) => void;
  addBadge: (badge: string) => void;
  setLastActiveDate: (date: string) => void;
}

export type UserStore = UserState & UserActions;

// ---------------------------------------------------------------------------
// XP → Level helper
// ---------------------------------------------------------------------------

/**
 * Calculates the user's level from their total XP.
 * Level n requires n * 500 XP to reach (cumulative thresholds).
 */
function xpToLevel(xp: number): number {
  if (xp < 0) return 1;
  return Math.floor(1 + Math.sqrt(xp / 250));
}

// ---------------------------------------------------------------------------
// Zustand Store
// ---------------------------------------------------------------------------

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // ── Actions ────────────────────────────────────────────────────────────

      /**
       * Sets the active user and marks the session as authenticated.
       * Pass `null` to clear the user (same effect as logout).
       */
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
        });
      },

      /**
       * Clears the user session, resetting all auth state.
       */
      logout: () => {
        void fetch("/api/auth/logout", { method: "POST" }).then((response) => {
          if (!response.ok) {
            console.error(`[useUser] Server sign-out failed (${response.status}).`);
          }
        }).catch((error: unknown) => {
          console.error("[useUser] Server sign-out failed:", error);
        });
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("phoenix_user");
          localStorage.removeItem("phoenix_active_profile");
        }
      },

      /**
       * Updates the user's current streak and optionally their longest streak.
       * If the new streak exceeds the stored longest streak, longest is updated
       * automatically even when `longestStreak` is not explicitly provided.
       */
      updateStreak: (streak: number, longestStreak?: number) => {
        const { user } = get();
        if (!user) return;

        const resolvedLongest =
          longestStreak !== undefined
            ? longestStreak
            : Math.max(streak, user.longestStreak);

        set({
          user: {
            ...user,
            streak,
            longestStreak: resolvedLongest,
          },
        });
      },

      /**
       * Adds XP to the user's total and recalculates their level.
       */
      addXP: (amount: number) => {
        const { user } = get();
        if (!user || amount <= 0) return;

        const newXP = user.xp + amount;
        const newLevel = xpToLevel(newXP);

        set({
          user: {
            ...user,
            xp: newXP,
            level: newLevel,
          },
        });
      },

      /**
       * Records or updates a topic's completion score for the current user.
       * Increments the attempt counter if a previous record exists.
       * Also awards XP based on the score delta improvement.
       */
      updateProgress: (topicId: string, score: number) => {
        const { user } = get();
        if (!user) return;

        const existing = user.progress[topicId];
        const clampedScore = Math.max(0, Math.min(100, score));

        const updatedRecord: TopicProgress = {
          topicId,
          score: clampedScore,
          completedAt: new Date().toISOString(),
          attempts: existing ? existing.attempts + 1 : 1,
        };

        // Award XP for improvement: every 10 points of score = 5 XP, max 50 XP
        const previousScore = existing ? existing.score : 0;
        const improvement = Math.max(0, clampedScore - previousScore);
        const xpReward = Math.floor((improvement / 10) * 5);

        const newXP = user.xp + xpReward;
        const newLevel = xpToLevel(newXP);

        set({
          user: {
            ...user,
            xp: newXP,
            level: newLevel,
            progress: {
              ...user.progress,
              [topicId]: updatedRecord,
            },
          },
        });
      },

      /**
       * Sets the global loading flag (e.g., while fetching user from Supabase).
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Updates the user's display name.
       */
      updateDisplayName: (name: string) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, displayName: name } });
      },

      /**
       * Updates the user's avatar URL.
       */
      updateAvatar: (url: string) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, avatarUrl: url } });
      },

      /**
       * Adds a badge to the user's collection (no-op if already held).
       */
      addBadge: (badge: string) => {
        const { user } = get();
        if (!user || user.badges.includes(badge)) return;
        set({ user: { ...user, badges: [...user.badges, badge] } });
      },

      /**
       * Updates the date the user was last active (ISO string).
       */
      setLastActiveDate: (date: string) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, lastActiveDate: date } });
      },
    }),
    {
      name: "phoenix-learn-user", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the user object and auth flag; omit transient loading state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ---------------------------------------------------------------------------
// useUser Hook
// ---------------------------------------------------------------------------

/**
 * useUser()
 *
 * Convenience hook that surfaces the full UserStore — state + all actions —
 * in one call. Components can destructure only what they need:
 *
 * ```ts
 * const { user, addXP, logout } = useUser();
 * ```
 */
export function useUser(): UserStore {
  return useUserStore((state) => state);
}

// ---------------------------------------------------------------------------
// Selector helpers (for performance-sensitive components)
// ---------------------------------------------------------------------------

/** Returns only the User object (or null). Avoids re-renders on action changes. */
export const useCurrentUser = () => useUserStore((s) => s.user);

/** Returns the isAuthenticated flag only. */
export const useIsAuthenticated = () => useUserStore((s) => s.isAuthenticated);

/** Returns the user's current XP and level. */
export const useXPLevel = () =>
  useUserStore((s) => ({ xp: s.user?.xp ?? 0, level: s.user?.level ?? 1 }));

/** Returns the user's full progress map. */
export const useUserProgress = () =>
  useUserStore((s) => s.user?.progress ?? {});
