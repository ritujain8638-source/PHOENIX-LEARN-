'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ContestItem {
  id: string;
  title: string;
  subject: string;
  start_time: string;
  duration_minutes: number;
  prize_pool: string;
  participants_count: number;
  status: 'live' | 'upcoming' | 'past';
}

interface LeaderboardItem {
  rank: number;
  name: string;
  class_level: string;
  xp: number;
  streak: number;
  avatar: string;
  tier: string;
}

export default function ContestsPage() {
  const [filter, setFilter] = useState<'live' | 'upcoming' | 'past'>('upcoming');
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadContests = async () => {
      try {
        const response = await fetch('/api/contests');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load contests.');
        if (!Array.isArray(result.contests) || !Array.isArray(result.leaderboard)) {
          throw new Error('Contest response was invalid.');
        }
        if (active) {
          setContests(result.contests);
          setLeaderboard(result.leaderboard);
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load contests.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadContests();
    return () => {
      active = false;
    };
  }, []);

  const liveParticipants = contests
    .filter((contest) => contest.status === 'live')
    .reduce((total, contest) => total + contest.participants_count, 0);

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
          <span>🔥</span> {liveParticipants.toLocaleString()} Competing Live
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
            {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300">{error}</p>}
            {loading && <p className="text-sm text-zinc-400">Loading contests…</p>}
            {contests
              .filter((contest) => contest.status === filter)
              .map((contest) => (
                <div
                  key={contest.id}
                  className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-orange-500/40 transition-all shadow-xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
                        contest.status === 'live'
                          ? 'bg-red-950/60 border-red-500/40 text-red-400 animate-pulse'
                          : contest.status === 'upcoming'
                          ? 'bg-orange-950/60 border-orange-500/40 text-orange-300'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}>
                        {contest.status}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {contest.status === 'live' ? 'Started' : contest.status === 'past' ? 'Ended' : 'Starts'}:{' '}
                        <strong className="text-amber-300">{new Date(contest.start_time).toLocaleString()}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{contest.title}</h3>
                    <p className="text-xs text-zinc-400 font-mono">{contest.subject}</p>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                      <span>⏱ {contest.duration_minutes} minutes</span>
                      <span>👥 {contest.participants_count} Competing</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <div className="text-right">
                      <div className="text-xs font-mono text-zinc-400">Grand Prize</div>
                      <div className="text-sm font-bold text-amber-400">{contest.prize_pool}</div>
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
            {!loading && !error && contests.filter((contest) => contest.status === filter).length === 0 && (
              <p className="rounded-xl border border-white/10 bg-zinc-950/80 p-6 text-sm text-zinc-400">
                No {filter} contests are scheduled.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Global Hall of Fame / Leaderboard */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>👑</span> Global Hall of Fame
              </h2>
              <span className="text-[10px] font-mono text-zinc-400">Opt-in ranking</span>
            </div>

            {/* Leaderboard entries */}
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className="p-3 rounded-xl border bg-zinc-900/50 border-white/5 hover:border-white/20 flex items-center justify-between transition-all"
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
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {user.class_level} • 🔥 {user.streak}d
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-amber-300">
                      {user.xp} XP
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono">
                      {user.tier}
                    </div>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-xs text-zinc-500">No students have opted in to the leaderboard yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
