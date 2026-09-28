/**
 * useNotifications.ts
 * Notifications hook for PhoenixLearn.
 * Fetches notifications from the API, supports mark-as-read (single + bulk),
 * and exposes the unread count.
 */

"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationType =
  | "streak_reminder"
  | "badge_earned"
  | "level_up"
  | "assignment_due"
  | "new_content"
  | "quiz_result"
  | "social"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO date string
  /** Optional deep-link path within the app. */
  actionUrl?: string;
  /** Optional icon/emoji override. */
  icon?: string;
  /** Optional metadata payload (e.g., badge details, XP amount). */
  meta?: Record<string, unknown>;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: Date | null;
}

export interface NotificationActions {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getUnreadCount: () => number;
  refetch: () => Promise<void>;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export type UseNotificationsReturn = NotificationState & NotificationActions;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NOTIFICATIONS_ENDPOINT = "/api/notifications";

/** How often to poll for new notifications (ms). Set to 0 to disable polling. */
const POLL_INTERVAL_MS = 60_000; // 1 minute

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countUnread(notifications: Notification[]): number {
  return notifications.filter((n) => !n.isRead).length;
}

/** Optimistically marks a notification as read in the local array. */
function applyReadLocally(
  notifications: Notification[],
  id: string
): Notification[] {
  return notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
}

/** Optimistically marks all notifications as read in the local array. */
function applyAllReadLocally(notifications: Notification[]): Notification[] {
  return notifications.map((n) => ({ ...n, isRead: true }));
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useNotifications()
 *
 * Manages the notification feed with automatic polling, optimistic UI updates,
 * and API persistence.
 *
 * ```tsx
 * const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
 * ```
 */
export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // ── fetch helper ──────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(NOTIFICATIONS_ENDPOINT, {
        headers: { "Content-Type": "application/json" },
        // Short timeout so a slow server doesn't block the UI
        signal: AbortSignal.timeout?.(8000),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications (${response.status})`);
      }

      const data = await response.json();

      // Support both { notifications: [...] } and plain array responses
      const items: Notification[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.notifications)
        ? data.notifications
        : [];

      if (isMountedRef.current) {
        setNotifications(items);
        setLastFetchedAt(new Date());
      }
    } catch (err) {
      if (isMountedRef.current) {
        const message =
          err instanceof Error ? err.message : "Unknown error fetching notifications";
        setError(message);
        console.error("[useNotifications] fetchNotifications:", message);
      }
    } finally {
      if (isMountedRef.current && !silent) setIsLoading(false);
    }
  }, []);

  // ── Initial fetch + polling ───────────────────────────────────────────────

  useEffect(() => {
    isMountedRef.current = true;
    fetchNotifications();

    if (POLL_INTERVAL_MS > 0) {
      pollIntervalRef.current = setInterval(() => {
        fetchNotifications(true /* silent */);
      }, POLL_INTERVAL_MS);
    }

    return () => {
      isMountedRef.current = false;
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchNotifications]);

  // ── markAsRead ────────────────────────────────────────────────────────────

  /**
   * Marks a single notification as read. Applies optimistic update immediately
   * and syncs to the server in the background.
   */
  const markAsRead = useCallback(
    async (id: string) => {
      // Optimistic update
      setNotifications((prev) => applyReadLocally(prev, id));

      try {
        const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/${id}/read`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          // Rollback optimistic update on failure
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
          );
          console.error(`[useNotifications] markAsRead failed for id ${id}`);
        }
      } catch (err) {
        // Rollback on network error
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
        );
        console.error("[useNotifications] markAsRead error:", err);
      }
    },
    []
  );

  // ── markAllAsRead ─────────────────────────────────────────────────────────

  /**
   * Marks every notification as read. Optimistically updates the UI and then
   * syncs all unread IDs to the server in a single batch request.
   */
  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications
      .filter((n) => !n.isRead)
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    // Optimistic update
    setNotifications((prev) => applyAllReadLocally(prev));

    try {
      const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/read-all`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unreadIds }),
      });

      if (!response.ok) {
        // Rollback — re-fetch the authoritative list from server
        await fetchNotifications(true);
        console.error("[useNotifications] markAllAsRead failed, rolled back");
      }
    } catch (err) {
      // Rollback
      await fetchNotifications(true);
      console.error("[useNotifications] markAllAsRead error:", err);
    }
  }, [notifications, fetchNotifications]);

  // ── getUnreadCount ────────────────────────────────────────────────────────

  /**
   * Returns the current unread notification count synchronously.
   * The `unreadCount` field in the returned state is equivalent but useful
   * for direct function calls (e.g., in computed callbacks).
   */
  const getUnreadCount = useCallback((): number => {
    return countUnread(notifications);
  }, [notifications]);

  // ── dismissNotification ───────────────────────────────────────────────────

  /**
   * Removes a notification from the local list without a server call.
   * Useful for transient / toast-style notifications.
   */
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ── clearAll ──────────────────────────────────────────────────────────────

  /**
   * Clears all notifications from local state (no server call).
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // ── refetch ───────────────────────────────────────────────────────────────

  /**
   * Manually re-fetches notifications from the server (non-silent, shows loader).
   */
  const refetch = useCallback(async () => {
    await fetchNotifications(false);
  }, [fetchNotifications]);

  // ── Derived state ─────────────────────────────────────────────────────────

  const unreadCount = countUnread(notifications);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    lastFetchedAt,
    // Actions
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    refetch,
    dismissNotification,
    clearAll,
  };
}

export default useNotifications;
