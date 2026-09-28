'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { useStreak } from '@/hooks/useStreak';
import { SUBJECTS } from '@/data/subjects';

export default function ProfilePage() {
  const { user } = useUser();
  const { streak } = useStreak();

  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'achievements'>('overview');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'mathematics',
    'physics',
    'chemistry'
  ]);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const badges = [
    { title: 'Ignition Spark', desc: 'Completed first session', icon: '🔥', unlocked: true },
    { title: 'Week on Fire', desc: 'Maintained a 7-day streak', icon: '⚡', unlocked: true },
    { title: 'Calculus Conqueror', desc: 'Solved 50 Math problems', icon: '∫', unlocked: true },
    { title: 'Arena Champion', desc: 'Finished Top 10 in a contest', icon: '🏆', unlocked: false },
    { title: 'Master of Laws', desc: 'Completed Physics mechanics', icon: '⚛️', unlocked: false }
  ];

  return (
    <div className="min-h-screen bg-void text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          ← Dashboard
        </Link>
        <span className="font-mono text-xs uppercase tracking-wider text-orange-400">
          Learner Profile
        </span>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Card Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(255,107,53,0.5)]">
              🦅
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-zinc-900 border border-orange-500/40 text-[10px] font-mono text-orange-400">
              LVL 4
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h1 className="text-2xl font-extrabold text-white">
                {user?.name || 'Phoenix Scholar'}
              </h1>
              <span className="text-xs font-mono text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Class 11-12 • JEE Aspirant
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {user?.email || 'scholar@phoenixlearn.app'}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-orange-400">🔥</span>
                <strong className="text-white">{streak || 7} Days</strong> Streak
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-amber-400">⚡</span>
                <strong className="text-white">{user?.totalXP || 2840}</strong> Total XP
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-cyan-400">🎯</span>
                <strong className="text-white">92%</strong> Average Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-white/10 pb-2">
          {(['overview', 'subjects', 'achievements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(255,107,53,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & LEARNING GAPS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Knowledge Gap Targeted AI Diagnostic */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <span>🧠</span> Personalized Adaptive Knowledge Diagnostic
                </h3>
                <span className="text-[10px] font-mono uppercase bg-red-950/60 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full">
                  2 Interventions Needed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-red-300">
                    <span>Complex Numbers: Argand Plane</span>
                    <span>42% Accuracy</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Misconception identified in finding argument $\theta$ when real part is negative.
                  </p>
                  <Link
                    href="/learn/math-t6"
                    className="inline-block mt-2 text-xs font-semibold text-orange-400 hover:text-orange-300"
                  >
                    Launch Targeted Intervention →
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-red-300">
                    <span>Physics: Static vs Kinetic Friction</span>
                    <span>48% Accuracy</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Tendency to apply $\mu_s N$ as the actual frictional force instead of limiting max threshold.
                  </p>
                  <Link
                    href="/learn/phy-t4"
                    className="inline-block mt-2 text-xs font-semibold text-orange-400 hover:text-orange-300"
                  >
                    Launch Targeted Intervention →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBJECT CURRICULUM SELECTION */}
        {activeTab === 'subjects' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 text-xs text-zinc-300">
              💡 Select which disciplines are included in your personalized Phoenix syllabus and daily quiz recommendations:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUBJECTS.map((sub) => {
                const isSelected = selectedSubjects.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => toggleSubject(sub.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-zinc-950/90 border-orange-500 shadow-[0_0_20px_rgba(255,107,53,0.15)]'
                        : 'bg-zinc-950/40 border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white font-black"
                        style={{ background: sub.gradient }}
                      >
                        {sub.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{sub.name}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-1">{sub.description}</p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ACHIEVEMENTS & BADGES */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                  badge.unlocked
                    ? 'bg-zinc-950/80 border-white/10 shadow-lg'
                    : 'bg-zinc-950/40 border-white/5 opacity-40'
                }`}
              >
                <div className="text-3xl p-3 rounded-2xl bg-white/5 border border-white/10">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    {badge.title}
                    {badge.unlocked && <span className="text-xs text-green-400 font-mono">UNLOCKED</span>}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
