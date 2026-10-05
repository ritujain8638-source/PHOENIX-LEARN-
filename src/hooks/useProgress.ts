/**
 * useProgress.ts
 * Learning progress hook for PhoenixLearn.
 * Tracks topic completion, quiz scores, time-on-task, and surfaces
 * mastery scores, weak topics, and next-topic recommendations.
 */

"use client";

import { useState, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TopicRecord {
  topicId: string;
  /** Weighted mastery score 0–100. */
  mastery: number;
  /** Raw scores from each quiz / exercise attempt. */
  scoreHistory: number[];
  /** Total seconds spent on this topic. */
  timeSpentSeconds: number;
  /** ISO date string of the last interaction. */
  lastStudiedAt: string | null;
  /** Number of completed learning sessions for this topic. */
  sessionsCompleted: number;
  /** Whether the user has explicitly marked this topic as complete. */
  isCompleted: boolean;
}

export interface ProgressState {
  /** Map of topicId → TopicRecord */
  topics: Record<string, TopicRecord>;
  /** Total learning time across all topics (seconds). */
  totalTimeSpentSeconds: number;
  /** ISO date string of when progress was last saved. */
  lastUpdatedAt: string | null;
}

export interface UseProgressReturn extends ProgressState {
  /** Returns mastery score 0–100 for a given topic. */
  calculateMastery: (topicId: string) => number;
  /** Returns array of topicIds where mastery < WEAK_THRESHOLD. */
  getWeakTopics: () => string[];
  /** Returns the next recommended topicId to study, or null. */
  getRecommendedNext: (orderedTopicIds?: string[]) => string | null;
  /** Records a quiz/exercise score for a topic and recalculates mastery. */
  saveProgress: (
    topicId: string,
    score: number,
    timeSpentSeconds?: number
  ) => void;
  /** Adds time spent on a topic without a score event. */
  addTimeSpent: (topicId: string, seconds: number) => void;
  /** Marks a topic as explicitly completed. */
  markCompleted: (topicId: string) => void;
  /** Resets all progress (confirmation guard built in). */
  resetProgress: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "phoenix-learn-progress";

/** Topics with mastery below this threshold are flagged as "weak". */
const WEAK_THRESHOLD = 50;

/**
 * Weights for the mastery calculation:
 * - recency:     most recent score counts the most
 * - consistency: low variance → higher mastery
 * - time:        more time spent → marginal mastery boost (cap 10 pts)
 */
const MASTERY_WEIGHTS = {
  recencyWeight: 0.6,
  historyWeight: 0.3,
  timeBonus: 0.1,
  maxTimeBonusSeconds: 3600, // 1 hour = full time bonus
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nowISO(): string {
  return new Date().toISOString();
}

function readFromStorage(): ProgressState {
  if (typeof window === "undefined") {
    return { topics: {}, totalTimeSpentSeconds: 0, lastUpdatedAt: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { topics: {}, totalTimeSpentSeconds: 0, lastUpdatedAt: null };
    }
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { topics: {}, totalTimeSpentSeconds: 0, lastUpdatedAt: null };
  }
}

function writeToStorage(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded — fail silently
  }
}

/**
 * Core mastery algorithm.
 *
 * Mastery = (recent score * 0.6) + (avg of history * 0.3) + (time bonus * 0.1)
 *
 * Where:
 * - "recent score"  = the last entry in scoreHistory
 * - "avg of history"= mean of all scores
 * - "time bonus"    = min(timeSpentSeconds / maxTimeBonusSeconds, 1) * 100
 */
function computeMastery(record: TopicRecord): number {
  const { scoreHistory, timeSpentSeconds } = record;
  if (scoreHistory.length === 0) return 0;

  const recentScore = scoreHistory[scoreHistory.length - 1];
  const avgScore =
    scoreHistory.reduce((sum, s) => sum + s, 0) / scoreHistory.length;
  const timeBonus =
    Math.min(timeSpentSeconds / MASTERY_WEIGHTS.maxTimeBonusSeconds, 1) * 100;

  const raw =
    recentScore * MASTERY_WEIGHTS.recencyWeight +
    avgScore * MASTERY_WEIGHTS.historyWeight +
    timeBonus * MASTERY_WEIGHTS.timeBonus;

  return Math.min(100, Math.max(0, Math.round(raw)));
}

/**
 * Returns a default TopicRecord for a new topic.
 */
function defaultRecord(topicId: string): TopicRecord {
  return {
    topicId,
    mastery: 0,
    scoreHistory: [],
    timeSpentSeconds: 0,
    lastStudiedAt: null,
    sessionsCompleted: 0,
    isCompleted: false,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useProgress()
 *
 * Provides full learning progress management including mastery calculation,
 * weak topic identification, and personalised "next topic" recommendations.
 *
 * ```ts
 * const { calculateMastery, getWeakTopics, getRecommendedNext, saveProgress } = useProgress();
 * ```
 */
export function useProgress(): UseProgressReturn {
  const [state, setState] = useState<ProgressState>(() => readFromStorage());

  // Hydrate from localStorage on mount (SSR-safe)
  useEffect(() => {
    setState(readFromStorage());
  }, []);

  // ── Internal updater ──────────────────────────────────────────────────────

  const update = useCallback((next: ProgressState) => {
    writeToStorage(next);
    setState(next);
  }, []);

  // ── calculateMastery ──────────────────────────────────────────────────────

  /**
   * Returns the mastery score (0–100) for a given topicId.
   * Returns 0 if the topic has never been studied.
   */
  const calculateMastery = useCallback(
    (topicId: string): number => {
      const record = state.topics[topicId];
      if (!record) return 0;
      return record.mastery;
    },
    [state.topics]
  );

  // ── getWeakTopics ─────────────────────────────────────────────────────────

  /**
   * Returns all topicIds that have been studied at least once but have a
   * mastery score below the WEAK_THRESHOLD (50 by default).
   */
  const getWeakTopics = useCallback((): string[] => {
    return Object.values(state.topics)
      .filter(
        (record) =>
          record.scoreHistory.length > 0 && record.mastery < WEAK_THRESHOLD
      )
      .sort((a, b) => a.mastery - b.mastery) // weakest first
      .map((record) => record.topicId);
  }, [state.topics]);

  // ── getRecommendedNext ────────────────────────────────────────────────────

  /**
   * Recommends the next topic to study using the following priority:
   * 1. Weak topics (mastery < WEAK_THRESHOLD) that have been started
   * 2. Topics in `orderedTopicIds` that haven't been started yet
   * 3. Topics with the lowest mastery among completed ones
   *
   * Pass an ordered curriculum array of topicIds to get curriculum-aware
   * recommendations.
   */
  const getRecommendedNext = useCallback(
    (orderedTopicIds: string[] = []): string | null => {
      // Priority 1: weakest started topic
      const weak = getWeakTopics();
      if (weak.length > 0) return weak[0];

      // Priority 2: first topic in the ordered curriculum not yet started
      for (const topicId of orderedTopicIds) {
        if (!state.topics[topicId]) return topicId;
      }

      // Priority 3: lowest mastery among topics not yet "completed"
      const incomplete = Object.values(state.topics).filter(
        (r) => !r.isCompleted
      );
      if (incomplete.length === 0) return null;

      incomplete.sort((a, b) => a.mastery - b.mastery);
      return incomplete[0].topicId;
    },
    [getWeakTopics, state.topics]
  );

  // ── saveProgress ──────────────────────────────────────────────────────────

  /**
   * Records a new score for a topic, recalculates mastery, and persists.
   * `timeSpentSeconds` is added to the topic's cumulative time.
   */
  const saveProgress = useCallback(
    (topicId: string, score: number, timeSpentSeconds = 0) => {
      const clampedScore = Math.max(0, Math.min(100, score));
      const existing = state.topics[topicId] ?? defaultRecord(topicId);

      const updatedRecord: TopicRecord = {
        ...existing,
        scoreHistory: [...existing.scoreHistory, clampedScore],
        timeSpentSeconds: existing.timeSpentSeconds + timeSpentSeconds,
        sessionsCompleted: existing.sessionsCompleted + 1,
        lastStudiedAt: nowISO(),
      };
      updatedRecord.mastery = computeMastery(updatedRecord);

      const nextState: ProgressState = {
        topics: { ...state.topics, [topicId]: updatedRecord },
        totalTimeSpentSeconds: state.totalTimeSpentSeconds + timeSpentSeconds,
        lastUpdatedAt: nowISO(),
      };

      update(nextState);

      // Non-blocking sync to the server
      fetch("/api/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, score: clampedScore, timeSpentSeconds }),
      }).catch((error: unknown) => {
        console.error("[useProgress] Unable to sync progress with the server:", error);
      });
    },
    [state, update]
  );

  // ── addTimeSpent ──────────────────────────────────────────────────────────

  /**
   * Adds passive time-on-task (e.g., reading lesson content) without a score.
   */
  const addTimeSpent = useCallback(
    (topicId: string, seconds: number) => {
      if (seconds <= 0) return;
      const existing = state.topics[topicId] ?? defaultRecord(topicId);

      const updatedRecord: TopicRecord = {
        ...existing,
        timeSpentSeconds: existing.timeSpentSeconds + seconds,
        lastStudiedAt: nowISO(),
      };
      updatedRecord.mastery = computeMastery(updatedRecord);

      const nextState: ProgressState = {
        topics: { ...state.topics, [topicId]: updatedRecord },
        totalTimeSpentSeconds: state.totalTimeSpentSeconds + seconds,
        lastUpdatedAt: nowISO(),
      };

      update(nextState);
    },
    [state, update]
  );

  // ── markCompleted ─────────────────────────────────────────────────────────

  /**
   * Explicitly marks a topic as completed (e.g., after finishing all lessons).
   */
  const markCompleted = useCallback(
    (topicId: string) => {
      const existing = state.topics[topicId] ?? defaultRecord(topicId);
      const updatedRecord: TopicRecord = {
        ...existing,
        isCompleted: true,
        lastStudiedAt: nowISO(),
      };

      update({
        ...state,
        topics: { ...state.topics, [topicId]: updatedRecord },
        lastUpdatedAt: nowISO(),
      });
    },
    [state, update]
  );

  // ── resetProgress ─────────────────────────────────────────────────────────

  /**
   * Clears all progress data. This is irreversible.
   */
  const resetProgress = useCallback(() => {
    const empty: ProgressState = {
      topics: {},
      totalTimeSpentSeconds: 0,
      lastUpdatedAt: nowISO(),
    };
    update(empty);
  }, [update]);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    ...state,
    calculateMastery,
    getWeakTopics,
    getRecommendedNext,
    saveProgress,
    addTimeSpent,
    markCompleted,
    resetProgress,
  };
}

export default useProgress;
