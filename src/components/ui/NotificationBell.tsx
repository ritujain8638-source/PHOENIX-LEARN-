'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Notification {
  id: string
  icon: string
  title: string
  message: string
  time: Date
  read: boolean
}

interface NotificationBellProps {
  notifications?: Notification[]
  onMarkAllRead?: () => void
  onNotificationClick?: (id: string) => void
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: '🔥',
    title: 'Streak Milestone!',
    message: 'You\'ve kept a 7-day learning streak. Keep it going!',
    time: new Date(Date.now() - 1000 * 60 * 3),
    read: false,
  },
  {
    id: '2',
    icon: '⚡',
    title: 'New XP Earned',
    message: 'You earned 250 XP for completing "React Hooks Deep Dive".',
    time: new Date(Date.now() - 1000 * 60 * 18),
    read: false,
  },
  {
    id: '3',
    icon: '🏆',
    title: 'Achievement Unlocked',
    message: '"First Hundred" — Complete 100 questions. Nicely done!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: '4',
    icon: '📚',
    title: 'New Course Available',
    message: 'TypeScript Mastery is now live. Enroll today for free!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 6),
    read: true,
  },
  {
    id: '5',
    icon: '💡',
    title: 'Daily Challenge Ready',
    message: 'Today\'s algorithm challenge is waiting for you.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: true,
  },
  {
    id: '6',
    icon: '🎯',
    title: 'Weekly Goal Progress',
    message: 'You\'re 80% toward your weekly learning goal!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
]

function BellIcon({ unread }: { unread: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <motion.path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        animate={unread > 0 ? { rotate: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
        style={{ transformOrigin: '12px 4px' }}
      />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function NotificationBell({
  notifications: propNotifications,
  onMarkAllRead,
  onNotificationClick,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    propNotifications ?? DEFAULT_NOTIFICATIONS
  )
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    onMarkAllRead?.()
  }, [onMarkAllRead])

  const handleNotificationClick = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      onNotificationClick?.(id)
    },
    [onNotificationClick]
  )

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-orange-300 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        style={{
          background: open
            ? 'rgba(249,115,22,0.12)'
            : 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'background 0.2s',
        }}
        whileHover={{ scale: 1.08, boxShadow: '0 0 14px 3px rgba(249,115,22,0.25)' }}
        whileTap={{ scale: 0.94 }}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
      >
        <BellIcon unread={unreadCount} />

        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #ea580c, #f97316)',
                boxShadow: '0 0 8px 2px rgba(249,115,22,0.6)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden z-50"
            style={{
              background:
                'linear-gradient(145deg, rgba(20,10,5,0.98) 0%, rgba(12,6,2,0.98) 100%)',
              border: '1px solid rgba(249,115,22,0.2)',
              boxShadow:
                '0 24px 48px rgba(0,0,0,0.6), 0 0 32px rgba(249,115,22,0.12)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: notifications.length > 5 ? '320px' : 'none' }}
            >
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-white/30">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.button
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id)}
                    className="w-full text-left px-4 py-3 flex gap-3 items-start transition-colors hover:bg-white/[0.04] focus:outline-none"
                    style={{
                      borderBottom:
                        i < notifications.length - 1
                          ? '1px solid rgba(255,255,255,0.04)'
                          : 'none',
                    }}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    {/* Icon */}
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
                      style={{
                        background: n.read
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(249,115,22,0.15)',
                        border: n.read
                          ? '1px solid rgba(255,255,255,0.07)'
                          : '1px solid rgba(249,115,22,0.3)',
                      }}
                    >
                      {n.icon}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-xs font-semibold leading-snug truncate ${
                            n.read ? 'text-white/60' : 'text-white'
                          }`}
                        >
                          {n.title}
                        </p>
                        <span className="text-[10px] text-white/30 flex-shrink-0 mt-0.5">
                          {timeAgo(n.time)}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] mt-0.5 leading-relaxed line-clamp-2 ${
                          n.read ? 'text-white/35' : 'text-white/55'
                        }`}
                      >
                        {n.message}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <span
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"
                        style={{ boxShadow: '0 0 6px rgba(249,115,22,0.8)' }}
                      />
                    )}
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/[0.07]">
              <button className="text-[11px] font-semibold text-orange-400/70 hover:text-orange-400 w-full text-center transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
