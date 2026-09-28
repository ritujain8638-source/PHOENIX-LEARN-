'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  questionsCount: number;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  urgency: 'high' | 'medium' | 'normal';
  xpReward: number;
}

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const assignments: AssignmentItem[] = [
    {
      id: 'asg-1',
      title: 'RD Sharma Calculus Problem Set 1',
      subject: 'Mathematics',
      chapter: 'Limits & Derivatives',
      questionsCount: 15,
      dueDate: 'Today, 11:59 PM',
      status: 'pending',
      urgency: 'high',
      xpReward: 300
    },
    {
      id: 'asg-2',
      title: 'Newton\'s Laws & Friction Free Body Diagrams',
      subject: 'Physics',
      chapter: 'Laws of Motion',
      questionsCount: 10,
      dueDate: 'Tomorrow, 6:00 PM',
      status: 'pending',
      urgency: 'medium',
      xpReward: 200
    },
    {
      id: 'asg-3',
      title: 'Stoichiometry & Limiting Reagents Lab Problems',
      subject: 'Chemistry',
      chapter: 'Basic Concepts of Chemistry',
      questionsCount: 12,
      dueDate: 'Completed 2 days ago',
      status: 'completed',
      urgency: 'normal',
      xpReward: 250
    }
  ];

  const filtered = assignments.filter((a) => (filter === 'all' ? true : a.status === filter));

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
              </div>

              <h3 className="text-base font-bold text-white">{item.title}</h3>

              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                <span>📝 {item.questionsCount} Questions</span>
                <span>⏱ Deadline: {item.dueDate}</span>
                <span className="text-amber-300">+{item.xpReward} XP</span>
              </div>
            </div>

            <div>
              {item.status === 'pending' ? (
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
