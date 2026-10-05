'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  questionsCount: number;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  urgency: 'high' | 'medium' | 'normal' | 'low';
  xpReward: number;
}

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadAssignments = async () => {
      try {
        const response = await fetch('/api/assignments');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load assignments.');
        if (!Array.isArray(result.assignments)) throw new Error('Assignment response was invalid.');

        const mapped: AssignmentItem[] = result.assignments.map((assignment: {
          id: number | string;
          title: string;
          subject: string;
          chapter: string;
          total_questions: number;
          due_date: string;
          status: 'pending' | 'completed';
          urgency: 'high' | 'medium' | 'normal' | 'low';
          xp_reward: number;
        }) => {
          const overdue = assignment.status === 'pending' && new Date(assignment.due_date).getTime() < Date.now();
          return {
            id: String(assignment.id),
            title: assignment.title,
            subject: assignment.subject,
            chapter: assignment.chapter,
            questionsCount: assignment.total_questions,
            dueDate: new Date(assignment.due_date).toLocaleString(),
            status: overdue ? 'overdue' : assignment.status,
            urgency: assignment.urgency,
            xpReward: assignment.xp_reward,
          };
        });
        if (active) setAssignments(mapped);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load assignments.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAssignments();
    return () => {
      active = false;
    };
  }, []);

  const filtered = assignments.filter((assignment) =>
    filter === 'all' ||
    (filter === 'pending' && (assignment.status === 'pending' || assignment.status === 'overdue')) ||
    assignment.status === filter
  );

  return (
    <div className="min-h-screen bg-void text-white pb-20">
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
          <h1 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <span>📝</span> Academic Assignments Zone
          </h1>
        </div>

        <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                filter === tab ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">{error}</p>}
        {loading && <p className="text-sm text-zinc-400">Loading assignments…</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-zinc-950/80 p-6 text-sm text-zinc-400">
            No {filter === 'all' ? '' : `${filter} `}assignments found.
          </p>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-orange-500/30 transition-all shadow-xl backdrop-blur-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-orange-950/50 text-orange-400 border border-orange-500/20">
                  {item.subject} • {item.chapter}
                </span>
                {item.urgency === 'high' && item.status === 'pending' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 animate-pulse">
                    URGENT DEADLINE
                  </span>
                )}
                {item.status === 'completed' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-950/60 border border-green-500/40 text-green-400">
                    ✓ COMPLETED
                  </span>
                )}
                {item.status === 'overdue' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400">
                    OVERDUE
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white">{item.title}</h3>

              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                <span>📝 {item.questionsCount} Questions</span>
                <span>⏱ Deadline: {item.dueDate}</span>
                <span className="text-amber-300">+{item.xpReward} XP</span>
              </div>
            </div>

            <div>
              {item.status === 'pending' || item.status === 'overdue' ? (
                <Link
                  href="/quiz/daily"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(255,107,53,0.4)] block text-center"
                >
                  Start Assignment →
                </Link>
              ) : (
                <button
                  disabled
                  className="px-5 py-2 rounded-xl bg-white/5 text-zinc-500 font-mono text-xs border border-white/5 cursor-not-allowed"
                >
                  Submitted
                </button>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
