'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileSetupData {
  avatar: number | null;
  photoUrl: string | null;
  goal: string;
  examTargets: string[];
  subjects: string[];
  dailyGoal: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

const EXAM_TARGETS = [
  { id: 'jee-main', label: 'JEE Main', icon: '⚛️', desc: 'Engineering entrance exam', color: 'from-blue-500 to-cyan-500' },
  { id: 'jee-advanced', label: 'JEE Advanced', icon: '🚀', desc: 'IIT admission gateway', color: 'from-violet-500 to-purple-600' },
  { id: 'neet', label: 'NEET', icon: '🩺', desc: 'Medical entrance exam', color: 'from-green-500 to-emerald-600' },
  { id: 'board', label: 'Board Exams', icon: '📚', desc: 'CBSE / State boards', color: 'from-orange-500 to-amber-500' },
  { id: 'general', label: 'General Learning', icon: '🌟', desc: 'Curiosity-driven study', color: 'from-pink-500 to-rose-500' },
  { id: 'coding', label: 'Coding', icon: '💻', desc: 'DSA, programming & CS', color: 'from-teal-500 to-green-500' },
];

const SUBJECTS = [
  { id: 'math', label: 'Mathematics', icon: '📐', color: 'from-blue-500 to-blue-600' },
  { id: 'physics', label: 'Physics', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪', color: 'from-purple-500 to-violet-600' },
  { id: 'biology', label: 'Biology', icon: '🧬', color: 'from-green-500 to-emerald-500' },
  { id: 'cs', label: 'Computer Science', icon: '💻', color: 'from-teal-500 to-cyan-500' },
  { id: 'english', label: 'English', icon: '📖', color: 'from-red-400 to-rose-500' },
  { id: 'history', label: 'History', icon: '🏛️', color: 'from-amber-500 to-yellow-600' },
  { id: 'geography', label: 'Geography', icon: '🌍', color: 'from-emerald-400 to-green-600' },
  { id: 'economics', label: 'Economics', icon: '📊', color: 'from-indigo-500 to-blue-600' },
];

const AVATARS = [
  { bg: 'from-orange-500 to-red-600', emoji: '🦅', label: 'Fire Hawk' },
  { bg: 'from-violet-500 to-purple-700', emoji: '🔮', label: 'Mystic' },
  { bg: 'from-blue-500 to-cyan-600', emoji: '⚡', label: 'Thunder' },
  { bg: 'from-emerald-500 to-green-700', emoji: '🌿', label: 'Nature' },
  { bg: 'from-pink-500 to-rose-600', emoji: '🌸', label: 'Bloom' },
  { bg: 'from-amber-500 to-yellow-600', emoji: '⭐', label: 'Star' },
];

const GOAL_PRESETS = [
  { mins: 15, label: '15 min', desc: 'Quick daily dose' },
  { mins: 30, label: '30 min', desc: 'Steady pace' },
  { mins: 45, label: '45 min', desc: 'Focused learner' },
  { mins: 60, label: '1 hour', desc: 'Committed student' },
  { mins: 90, label: '90 min', desc: 'Serious achiever' },
];

const PHOENIX_QUOTES = [
  "I've analysed 2,847 toppers. Their secret? Consistency. Let's build yours, one day at a time. 🔥",
  "Every IITian started exactly where you are. The difference? They had a plan. Now you do too. ⚡",
  "Fun fact: Students who set daily goals score 37% higher. You've already made the smart choice. 🚀",
  "I'm not just an AI — I'm your study partner, exam strategist, and hype squad all in one. Let's go! 🦅",
];

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Step {step} of {TOTAL_STEPS}</span>
        <span className="text-orange-400 text-xs font-medium">{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${i < step ? 'bg-orange-500' : 'bg-white/20'}`}
            animate={{ scale: i + 1 === step ? 1.3 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Avatar ───────────────────────────────────────────────────────────

function Step1Avatar({
  data,
  setData,
  userName,
}: {
  data: ProfileSetupData;
  setData: React.Dispatch<React.SetStateAction<ProfileSetupData>>;
  userName: string;
}) {
  const firstName = userName.split(' ')[0] || 'Champion';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl mb-3"
        >
          👋
        </motion.div>
        <h2 className="text-white text-2xl font-bold">
          Welcome, <span className="text-orange-400">{firstName}!</span>
        </h2>
        <p className="text-white/50 text-sm mt-1">Let's set up your profile. First, pick an avatar.</p>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-3 gap-4">
        {AVATARS.map((av, i) => (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setData((d) => ({ ...d, avatar: i }))}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
              data.avatar === i
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            {data.avatar === i && (
              <motion.div
                layoutId="avatar-check"
                className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs"
              >
                ✓
              </motion.div>
            )}
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${av.bg} flex items-center justify-center text-3xl shadow-lg`}
            >
              {av.emoji}
            </div>
            <span className="text-white/70 text-xs font-medium">{av.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Upload option */}
      <div className="text-center">
        <label className="cursor-pointer inline-flex items-center gap-2 text-orange-400 text-sm hover:text-orange-300 transition border border-orange-500/30 rounded-xl px-4 py-2 hover:bg-orange-500/5">
          <span>📸</span>
          <span>Upload your own photo</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setData((d) => ({ ...d, photoUrl: url, avatar: null }));
              }
            }}
          />
        </label>
        {data.photoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex flex-col items-center gap-2"
          >
            <img
              src={data.photoUrl}
              alt="Custom avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-lg"
            />
            <span className="text-green-400 text-xs">✓ Photo uploaded!</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Exam Target ──────────────────────────────────────────────────────

function Step2ExamTarget({
  data,
  setData,
}: {
  data: ProfileSetupData;
  setData: React.Dispatch<React.SetStateAction<ProfileSetupData>>;
}) {
  const toggle = (id: string) => {
    setData((d) => ({
      ...d,
      examTargets: d.examTargets.includes(id)
        ? d.examTargets.filter((e) => e !== id)
        : [...d.examTargets, id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl mb-3"
        >
          🎯
        </motion.div>
        <h2 className="text-white text-2xl font-bold">What are you preparing for?</h2>
        <p className="text-white/50 text-sm mt-1">Select all that apply — you can change this later.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EXAM_TARGETS.map((target, i) => {
          const selected = data.examTargets.includes(target.id);
          return (
            <motion.button
              key={target.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(target.id)}
              className={`relative text-left p-4 rounded-2xl border-2 transition ${
                selected
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs"
                >
                  ✓
                </motion.div>
              )}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${target.color} flex items-center justify-center text-xl mb-2 shadow-md`}
              >
                {target.icon}
              </div>
              <div className="text-white font-semibold text-sm">{target.label}</div>
              <div className="text-white/40 text-xs mt-0.5">{target.desc}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 3: Subjects ─────────────────────────────────────────────────────────

function Step3Subjects({
  data,
  setData,
}: {
  data: ProfileSetupData;
  setData: React.Dispatch<React.SetStateAction<ProfileSetupData>>;
}) {
  const toggle = (id: string) => {
    setData((d) => ({
      ...d,
      subjects: d.subjects.includes(id)
        ? d.subjects.filter((s) => s !== id)
        : [...d.subjects, id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl mb-3"
        >
          📚
        </motion.div>
        <h2 className="text-white text-2xl font-bold">Select your subjects</h2>
        <p className="text-white/50 text-sm mt-1">
          Pick subjects you&apos;re studying.{' '}
          {data.subjects.length > 0 && (
            <span className="text-orange-400 font-medium">{data.subjects.length} selected</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SUBJECTS.map((subject, i) => {
          const selected = data.subjects.includes(subject.id);
          return (
            <motion.button
              key={subject.id}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(subject.id)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
                selected
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px]"
                >
                  ✓
                </motion.div>
              )}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl shadow-md`}
              >
                {subject.icon}
              </div>
              <span className="text-white/80 text-xs font-medium text-center">{subject.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4: Daily Goal ───────────────────────────────────────────────────────

function Step4DailyGoal({
  data,
  setData,
}: {
  data: ProfileSetupData;
  setData: React.Dispatch<React.SetStateAction<ProfileSetupData>>;
}) {
  const pct = ((data.dailyGoal - 15) / (120 - 15)) * 100;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl mb-3"
        >
          ⏱️
        </motion.div>
        <h2 className="text-white text-2xl font-bold">Set your daily goal</h2>
        <p className="text-white/50 text-sm mt-1">How long can you study each day? Be honest — consistency beats intensity.</p>
      </div>

      {/* Big display */}
      <motion.div
        key={data.dailyGoal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/30">
          <span className="text-white text-4xl font-bold leading-none">
            {data.dailyGoal < 60 ? data.dailyGoal : `${(data.dailyGoal / 60).toFixed(data.dailyGoal % 60 === 0 ? 0 : 1)}`}
          </span>
          <span className="text-orange-200 text-sm">{data.dailyGoal < 60 ? 'min' : 'hr'}</span>
        </div>
      </motion.div>

      {/* Slider */}
      <div className="px-2">
        <div className="relative">
          <input
            type="range"
            min={15}
            max={120}
            step={5}
            value={data.dailyGoal}
            onChange={(e) => setData((d) => ({ ...d, dailyGoal: Number(e.target.value) }))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f97316 0%, #dc2626 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
            }}
          />
        </div>
        <div className="flex justify-between text-white/30 text-xs mt-1">
          <span>15 min</span>
          <span>120 min</span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="grid grid-cols-5 gap-2">
        {GOAL_PRESETS.map((preset) => (
          <motion.button
            key={preset.mins}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setData((d) => ({ ...d, dailyGoal: preset.mins }))}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition ${
              data.dailyGoal === preset.mins
                ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/25'
            }`}
          >
            <span className="text-sm font-bold">{preset.label}</span>
            <span className="text-[10px] leading-none text-center hidden sm:block">{preset.desc}</span>
          </motion.button>
        ))}
      </div>

      {/* Encouragement */}
      <motion.div
        key={data.dailyGoal}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-4 bg-white/5 rounded-2xl border border-white/10"
      >
        <p className="text-white/70 text-sm">
          {data.dailyGoal <= 20 && '🌱 Great start! Even 15 minutes of focused study beats hours of distracted reading.'}
          {data.dailyGoal > 20 && data.dailyGoal <= 40 && '📗 Solid choice! 30 minutes daily adds up to 182 hours a year.'}
          {data.dailyGoal > 40 && data.dailyGoal <= 60 && '💪 You mean business! 45-60 minutes is the sweet spot for deep learning.'}
          {data.dailyGoal > 60 && data.dailyGoal <= 90 && '🔥 Serious mode activated! Top students swear by this schedule.'}
          {data.dailyGoal > 90 && '🚀 Beast mode! Make sure you take breaks — your brain needs recovery time too.'}
        </p>
      </motion.div>
    </div>
  );
}

// ─── Step 5: Meet Phoenix ─────────────────────────────────────────────────────

function Step5MeetPhoenix({ userName, dailyGoal }: { userName: string; dailyGoal: number }) {
  const [quoteIndex] = useState(() => Math.floor(Math.random() * PHOENIX_QUOTES.length));
  const [typedText, setTypedText] = useState('');
  const fullText = PHOENIX_QUOTES[quoteIndex];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [fullText]);

  const firstName = userName.split(' ')[0] || 'Champion';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-white text-2xl font-bold">
          Meet <span className="text-orange-400">Phoenix</span> 🔥
        </h2>
        <p className="text-white/50 text-sm mt-1">Your AI study companion is ready to roll!</p>
      </div>

      {/* Phoenix Animation */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-500/30 blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-red-600 flex items-center justify-center text-7xl shadow-2xl shadow-orange-500/40">
            🦅
          </div>
          {/* Orbit sparks */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{ top: '50%', left: '50%' }}
              animate={{
                x: Math.cos((deg * Math.PI) / 180) * 75 - 4,
                y: Math.sin((deg * Math.PI) / 180) * 75 - 4,
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.33,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 relative max-w-sm"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-orange-500/20" />
          <div className="bg-white/5 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p className="text-white/80 text-sm leading-relaxed min-h-[60px]">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-4 bg-orange-400 ml-0.5 align-middle"
              />
            </p>
          </div>
        </motion.div>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5"
      >
        <h3 className="text-white font-semibold mb-3 text-sm">Your Learning Profile 📋</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-orange-400">👤</span>
            <span className="text-white/60 text-sm">{firstName}&apos;s PhoenixLearn Journey</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-400">⏱️</span>
            <span className="text-white/60 text-sm">
              Daily goal: <span className="text-white font-medium">{dailyGoal} minutes</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🔥</span>
            <span className="text-white/60 text-sm">
              Streak starts: <span className="text-white font-medium">Today!</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Confetti-style dots */}
      <div className="relative h-8 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${(i / 20) * 100}%`,
              backgroundColor: ['#f97316', '#fbbf24', '#dc2626', '#fb923c'][i % 4],
            }}
            animate={{ y: [-20, 40], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Navigation Buttons ───────────────────────────────────────────────────────

function NavButtons({
  step,
  onBack,
  onNext,
  onFinish,
  canNext,
  isLoading,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  canNext: boolean;
  isLoading: boolean;
}) {
  return (
    <div className="flex gap-3 mt-8">
      {step > 1 && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 font-medium hover:bg-white/5 hover:text-white transition text-sm"
        >
          ← Back
        </motion.button>
      )}
      <motion.button
        type="button"
        whileHover={{ scale: canNext ? 1.02 : 1 }}
        whileTap={{ scale: canNext ? 0.97 : 1 }}
        onClick={step === TOTAL_STEPS ? onFinish : onNext}
        disabled={!canNext || isLoading}
        className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
          canNext
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-orange-500/25 hover:shadow-orange-500/40'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Setting up…
          </>
        ) : step === TOTAL_STEPS ? (
          <>🚀 Go to Dashboard</>
        ) : (
          <>Continue →</>
        )}
      </motion.button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Champion');

  const [data, setData] = useState<ProfileSetupData>({
    avatar: 0,
    photoUrl: null,
    goal: '',
    examTargets: [],
    subjects: [],
    dailyGoal: 45,
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('phoenixUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserName(parsed.fullName || 'Champion');
      }
    } catch {}
  }, []);

  const canGoNext = (): boolean => {
    if (step === 1) return data.avatar !== null || data.photoUrl !== null;
    if (step === 2) return data.examTargets.length > 0;
    if (step === 3) return data.subjects.length > 0;
    if (step === 4) return data.dailyGoal >= 15;
    if (step === 5) return true;
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleFinish = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    router.push('/dashboard');
  };

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col items-center justify-start py-8 px-4">
      {/* Background decoration */}
      <div className="fixed -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 self-start sm:self-center">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-orange-500/30">
          🔥
        </div>
        <span className="text-white text-xl font-bold tracking-tight">
          Phoenix<span className="text-orange-400">Learn</span>
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg">
        {/* Progress */}
        <ProgressBar step={step} />

        {/* Step content */}
        <div className="bg-[#1a1030] border border-white/10 rounded-3xl p-6 sm:p-8 min-h-[480px] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {step === 1 && <Step1Avatar data={data} setData={setData} userName={userName} />}
                {step === 2 && <Step2ExamTarget data={data} setData={setData} />}
                {step === 3 && <Step3Subjects data={data} setData={setData} />}
                {step === 4 && <Step4DailyGoal data={data} setData={setData} />}
                {step === 5 && <Step5MeetPhoenix userName={userName} dailyGoal={data.dailyGoal} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Validation hint */}
          <AnimatePresence>
            {!canGoNext() && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-orange-400/70 text-xs text-center mt-4"
              >
                {step === 1 && 'Please select an avatar or upload a photo'}
                {step === 2 && 'Please select at least one exam target'}
                {step === 3 && 'Please select at least one subject'}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <NavButtons
            step={step}
            onBack={handleBack}
            onNext={handleNext}
            onFinish={handleFinish}
            canNext={canGoNext()}
            isLoading={isLoading}
          />
        </div>

        {/* Skip link */}
        {step < TOTAL_STEPS && (
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-white/30 text-xs hover:text-white/50 transition"
            >
              Skip setup for now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
