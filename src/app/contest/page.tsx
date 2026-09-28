'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ContestsPage() {
  const [filter, setFilter] = useState<'live' | 'upcoming' | 'past'>('live');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'weekly' | 'all-time'>('weekly');

  const contests = [
    {
      id: 'math-clash-12',
      title: 'Grand Calculus & Algebra Arena',
      subject: 'Mathematics (RD Sharma Class 11-12)',
      duration: '45 Mins',
      questions: 25,
      prizeXP: 1000,
      participants: 1420,
      status: 'live',
      endsIn: '02:14:30',
      difficulty: 'JEE Advanced'
    },
    {
      id: 'physics-sprint',
      title: 'Quantum & Kinematics Blitz',
      subject: 'Physics (Mechanics + Waves)',
      duration: '30 Mins',
      questions: 20,
      prizeXP: 750,
      participants: 980,
      status: 'live',
      endsIn: '00:45:10',
      difficulty: 'JEE Main'
    },
    {
      id: 'organic-showdown',
      title: 'Reaction Mechanisms Royale',
      subject: 'Chemistry',
      duration: '40 Mins',
      questions: 30,
      prizeXP: 1200,
      participants: 2310,
      status: 'upcoming',
      startsIn: 'Tomorrow, 7:00 PM',
      difficulty: 'Hard'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Aarav Sharma', class: 'Class 12', xp: 14500, streak: 42, avatar: '🦅', title: 'Phoenix Sovereign' },
    { rank: 2, name: 'Diya Patel', class: 'Class 12', xp: 13920, streak: 35, avatar: '⚡', title: 'Solar Blaze' },
    { rank: 3, name: 'Rohan Verma', class: 'Class 11', xp: 12840, streak: 28, avatar: '🔥', title: 'Crimson Wing' },
    { rank: 4, name: 'Ananya Roy', class: 'Class 11', xp: 11400, streak: 21, avatar: '🌟', title: 'Rising Ember' },
    { rank: 5, name: 'Ishaan Gupta', class: 'Class 10', xp: 9850, streak: 19, avatar: '✨', title: 'Kindling Flame' },
    { rank: 24, name: 'You (Phoenix Learner)', class: 'Class 12', xp: 4200, streak: 7, avatar: '🔥', title: 'Rising Ember', isUser: true }
  ];

  return (
    <div className="min-h-screen bg-void text-white pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <span>🏆</span> Phoenix Arena & Contests
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-orange-950/40 border border-orange-500/30 px-3 py-1.5 rounded-full text-orange-400">
          <span>🔥</span> 1,400+ Competing Live
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contests Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Pills */}
          <div className="flex gap-2">
            {(['live', 'upcoming', 'past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold uppercase tracking-wider transition-all ${
                  filter === tab
                    ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(255,107,53,0.5)]'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {tab} Arenas
              </button>
            ))}
          </div>

          {/* Contests List */}
          <div className="space-y-4">
            {contests
              .filter((c) => filter === 'all' || c.status === filter || filter === 'live')
              .map((contest) => (
                <div
                  key={contest.id}
                  className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-orange-500/40 transition-all shadow-xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-red-950/60 border border-red-500/40 text-red-400 animate-pulse">
                        ● LIVE NOW
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        Ends in: <strong className="text-amber-300">{contest.endsIn}</strong>
                      </span>
                      <span className="text-xs font-mono text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md bg-orange-950/30">
                        {contest.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{contest.title}</h3>
                    <p className="text-xs text-zinc-400 font-mono">{contest.subject}</p>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                      <span>⏱ {contest.duration}</span>
                      <span>📝 {contest.questions} Questions</span>
                      <span>👥 {contest.participants} Competing</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <div className="text-right">
                      <div className="text-xs font-mono text-zinc-400">Grand Prize</div>
                      <div className="text-xl font-black text-amber-400">+{contest.prizeXP} XP</div>
                    </div>
                    <Link
                      href={`/quiz/contest-${contest.id}`}
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-bold text-sm text-center transition-all shadow-[0_0_20px_rgba(255,107,53,0.4)]"
                    >
                      Enter Arena 🔥
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Column: Global Hall of Fame / Leaderboard */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>👑</span> Global Hall of Fame
              </h2>
              <div className="flex gap-1 text-[10px] font-mono bg-white/5 p-1 rounded-lg">
                <button
                  onClick={() => setLeaderboardFilter('weekly')}
                  className={`px-2 py-0.5 rounded ${
                    leaderboardFilter === 'weekly' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setLeaderboardFilter('all-time')}
                  className={`px-2 py-0.5 rounded ${
                    leaderboardFilter === 'all-time' ? 'bg-orange-500 text-white' : 'text-zinc-400'
                  }`}
                >
                  All-Time
                </button>
              </div>
            </div>

            {/* Leaderboard entries */}
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    user.isUser
                      ? 'bg-orange-950/40 border-orange-500/60 ring-1 ring-orange-500/40'
                      : 'bg-zinc-900/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-mono font-bold text-sm ${
                        user.rank === 1
                          ? 'text-amber-400'
                          : user.rank === 2
                          ? 'text-zinc-300'
                          : user.rank === 3
                          ? 'text-amber-600'
                          : 'text-zinc-500'
                      }`}
                    >
                      #{user.rank}
                    </span>
                    <span className="text-xl">{user.avatar}</span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {user.name}
                        {user.isUser && (
                          <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.2 rounded font-mono">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {user.class} • 🔥 {user.streak}d
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-amber-300">
                      {user.xp} XP
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono">
                      {user.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
