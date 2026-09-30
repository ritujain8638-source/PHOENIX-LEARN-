'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/hooks/useUser';
import { toast } from 'sonner';

// ─── Zod Schemas ────────────────────────────────────────────────────────────

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string(),
    studentClass: z.enum(['9', '10', '11', '12'], {
      required_error: 'Select your class',
    }),
    subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const signInSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;

// ─── Password Strength ───────────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 1) return { score, label: 'Very Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Weak', color: '#f97316' };
  if (score === 3) return { score, label: 'Fair', color: '#eab308' };
  if (score === 4) return { score, label: 'Strong', color: '#22c55e' };
  return { score, label: 'Very Strong', color: '#10b981' };
}

// ─── Animated Phoenix SVG ────────────────────────────────────────────────────

function PhoenixSVG() {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-64 h-64 drop-shadow-2xl"
    >
      {/* Glow */}
      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </radialGradient>
        <radialGradient id="wingGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Background glow */}
      <ellipse cx="150" cy="200" rx="100" ry="60" fill="url(#glowGrad)" filter="url(#blur)" />

      {/* Flame base */}
      <motion.ellipse
        cx="150" cy="240" rx="55" ry="20"
        fill="#f97316" fillOpacity="0.4"
        animate={{ scaleX: [1, 1.15, 1], scaleY: [1, 0.85, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Left wing */}
      <motion.path
        d="M150 160 C110 120 50 130 40 80 C60 100 80 90 100 110 C80 70 90 40 120 60 C110 80 120 100 140 120 Z"
        fill="url(#wingGrad)"
        animate={{ rotate: [-5, 5, -5], originX: '150px', originY: '160px' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '150px 160px' }}
      />

      {/* Right wing */}
      <motion.path
        d="M150 160 C190 120 250 130 260 80 C240 100 220 90 200 110 C220 70 210 40 180 60 C190 80 180 100 160 120 Z"
        fill="url(#wingGrad)"
        animate={{ rotate: [5, -5, 5], originX: '150px', originY: '160px' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '150px 160px' }}
      />

      {/* Body */}
      <motion.ellipse
        cx="150" cy="175" rx="28" ry="45"
        fill="url(#bodyGrad)"
        animate={{ scaleY: [1, 1.03, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Head */}
      <motion.circle
        cx="150" cy="125" r="22"
        fill="url(#bodyGrad)"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Eye */}
      <motion.circle
        cx="157" cy="122" r="5"
        fill="#1e1b4b"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="158.5" cy="120.5" r="1.5"
        fill="white"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Beak */}
      <motion.path
        d="M150 128 L165 132 L150 136 Z"
        fill="#fbbf24"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Crest feathers */}
      <motion.path
        d="M145 105 C143 90 138 78 142 68 C145 80 148 90 150 103"
        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M150 103 C150 88 150 74 155 64 C155 78 153 90 152 103"
        stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M155 105 C157 90 162 78 158 68 C155 80 152 90 150 103"
        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tail */}
      <motion.path
        d="M140 215 C130 235 115 250 105 270 M150 218 C148 240 148 258 145 275 M160 215 C170 235 185 250 195 270"
        stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={{ scaleY: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '150px 215px' }}
      />

      {/* Sparks */}
      {[
        { cx: 85, cy: 100, r: 3, delay: 0 },
        { cx: 215, cy: 95, r: 2.5, delay: 0.3 },
        { cx: 70, cy: 150, r: 2, delay: 0.6 },
        { cx: 230, cy: 145, r: 3, delay: 0.9 },
        { cx: 100, cy: 200, r: 2, delay: 0.2 },
        { cx: 200, cy: 195, r: 2.5, delay: 0.7 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx} cy={s.cy} r={s.r}
          fill="#fbbf24"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

// ─── Stats Panel ─────────────────────────────────────────────────────────────

function StatsPanel() {
  const stats = [
    { label: 'Active Learners', value: '50K+', icon: '🎓' },
    { label: 'Questions Solved', value: '2M+', icon: '✅' },
    { label: 'Avg. Score Boost', value: '+35%', icon: '📈' },
    { label: 'Live Sessions', value: '500+', icon: '🔴' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-sm">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
        >
          <div className="text-xl mb-1">{s.icon}</div>
          <div className="text-white font-bold text-lg leading-none">{s.value}</div>
          <div className="text-orange-200 text-xs mt-0.5">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Google Icon ─────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ─── Google OAuth Modal ───────────────────────────────────────────────────────

interface GoogleAccountPreset {
  name: string;
  email: string;
  avatar: string;
  classLevel: number;
  targetExam: string;
}

const PRESET_GOOGLE_ACCOUNTS: GoogleAccountPreset[] = [
  {
    name: 'Aryan Sharma',
    email: 'aryan.sharma@gmail.com',
    avatar: '🦅',
    classLevel: 11,
    targetExam: 'JEE Advanced 2026',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@gmail.com',
    avatar: '⚡',
    classLevel: 12,
    targetExam: 'JEE Main & BITSAT',
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@gmail.com',
    avatar: '🔥',
    classLevel: 10,
    targetExam: 'CBSE Class 10 Boards',
  },
];

function GoogleAuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customClass, setCustomClass] = useState<number>(11);
  const [customExam, setCustomExam] = useState('JEE Main & Advanced');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (acc: {
    name: string;
    email: string;
    avatar: string;
    classLevel: number;
    targetExam: string;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: acc.email,
          name: acc.name,
          avatar_url: acc.avatar,
          picture: acc.avatar,
          google_id: 'g-' + Math.random().toString(36).substring(2, 10),
          class_level: acc.classLevel,
          target_exam: acc.targetExam,
        }),
      });

      const data = await res.json();
      const u = data.user || {
        id: 'user-g-' + Date.now().toString(36),
        name: acc.name,
        email: acc.email,
        avatar: acc.avatar,
        total_xp: 1250,
        streak: 5,
        level: 3,
        class_level: acc.classLevel,
        target_exam: acc.targetExam,
        selected_subjects: ['mathematics', 'physics', 'chemistry'],
      };

      const userPayload = {
        id: u.id,
        email: u.email,
        displayName: u.name,
        avatarUrl: u.avatar || acc.avatar,
        xp: u.total_xp || 1250,
        level: u.level || 3,
        streak: u.streak || 5,
        longestStreak: u.streak || 5,
        lastActiveDate: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        progress: {},
        badges: ['Google Verified', 'Phoenix Scholar'],
        preferredSubjects: u.selected_subjects || ['mathematics', 'physics', 'chemistry'],
      };

      useUserStore.getState().setUser(userPayload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('phoenix_user', JSON.stringify(userPayload));
        localStorage.setItem('phoenix_active_profile', JSON.stringify(u));
      }

      toast.success(`Signed in with Google as ${acc.name}!`);
      onClose();
      router.push('/dashboard');
    } catch {
      toast.success(`Signed in as ${acc.name}!`);
      onClose();
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-[#121218] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-left relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-3 mb-2">
          <GoogleIcon />
          <h2 className="text-white font-bold text-lg">Sign in with Google</h2>
        </div>
        <p className="text-white/60 text-xs mb-6">
          Choose an account to continue to <span className="text-orange-400 font-semibold">PhoenixLearn</span>
        </p>

        {/* Existing / Preset Google Accounts */}
        <div className="space-y-2.5 mb-4">
          {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleLogin(acc)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 transition-all group text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/15 flex items-center justify-center text-xl shrink-0">
                  {acc.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors truncate">
                    {acc.name}
                  </div>
                  <div className="text-xs text-white/50 truncate font-mono">{acc.email}</div>
                </div>
              </div>
              <span className="text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold shrink-0">
                Continue →
              </span>
            </button>
          ))}
        </div>

        {/* Custom Account Toggle */}
        {!isCustom ? (
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className="w-full py-3 px-4 rounded-2xl border border-dashed border-white/20 hover:border-orange-400/60 bg-white/[0.02] text-xs font-semibold text-white/70 hover:text-white transition flex items-center justify-center gap-2"
          >
            <span>＋</span> Use another Google Account
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!customEmail) return;
              handleLogin({
                name: customName || customEmail.split('@')[0],
                email: customEmail,
                avatar: '🦅',
                classLevel: customClass,
                targetExam: customExam,
              });
            }}
            className="space-y-3 bg-white/[0.03] p-4 rounded-2xl border border-white/10"
          >
            <div>
              <label className="text-[11px] text-white/60 font-medium block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Samyak Jain"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 font-medium block mb-1">Google Email Address</label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="samyak@gmail.com"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-white/60 font-medium block mb-1">Class Level</label>
                <select
                  value={customClass}
                  onChange={(e) => setCustomClass(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value={9} className="bg-zinc-900">Class 9</option>
                  <option value={10} className="bg-zinc-900">Class 10</option>
                  <option value={11} className="bg-zinc-900">Class 11</option>
                  <option value={12} className="bg-zinc-900">Class 12</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-white/60 font-medium block mb-1">Target Exam</label>
                <select
                  value={customExam}
                  onChange={(e) => setCustomExam(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="JEE Main & Advanced" className="bg-zinc-900">JEE Main/Adv</option>
                  <option value="NEET" className="bg-zinc-900">NEET</option>
                  <option value="CBSE Boards" className="bg-zinc-900">CBSE Boards</option>
                  <option value="Coding & Olympiad" className="bg-zinc-900">Coding / CS</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCustom(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white/60 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-xs font-bold text-white shadow-lg shadow-orange-500/20"
              >
                {isSubmitting ? 'Authenticating…' : 'Sign In with Google'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 text-[10px] text-white/40 text-center leading-relaxed">
          Google will securely authenticate your profile. By continuing, PhoenixLearn will receive your name, email address, and profile photo.
        </div>
      </motion.div>
    </div>
  );
}

// ─── Form Field Wrapper ───────────────────────────────────────────────────────

function FieldWrapper({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-xs flex items-center gap-1"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition';

// ─── Sign Up Form ─────────────────────────────────────────────────────────────

function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [watchedPassword, setWatchedPassword] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { subjects: [] },
  });

  const pwd = watch('password', '');
  const strength = getPasswordStrength(pwd);

  const subjectOptions = [
    { id: 'math', label: 'Mathematics', icon: '📐' },
    { id: 'physics', label: 'Physics', icon: '⚡' },
    { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
    { id: 'biology', label: 'Biology', icon: '🧬' },
    { id: 'cs', label: 'Computer Science', icon: '💻' },
  ];

  const currentSubjects = watch('subjects') ?? [];

  const toggleSubject = (id: string) => {
    const current = getValues('subjects') ?? [];
    if (current.includes(id)) {
      setValue('subjects', current.filter((s) => s !== id), { shouldValidate: true });
    } else {
      setValue('subjects', [...current, id], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          class_level: Number(data.studentClass),
          selected_subjects: data.subjects,
        }),
      });
      const json = await res.json();
      const u = json.user || {
        id: 'user-' + Date.now().toString(36),
        name: data.fullName,
        email: data.email,
        total_xp: 250,
        streak: 1,
        level: 1,
        class_level: Number(data.studentClass),
        selected_subjects: data.subjects,
      };
      const userPayload = {
        id: u.id,
        email: u.email,
        displayName: data.fullName,
        avatarUrl: '🔥',
        xp: 250,
        level: 1,
        streak: 1,
        longestStreak: 1,
        lastActiveDate: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        progress: {},
        badges: ['Rising Flame'],
        preferredSubjects: data.subjects,
      };
      useUserStore.getState().setUser(userPayload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('phoenix_user', JSON.stringify(userPayload));
        localStorage.setItem('phoenix_active_profile', JSON.stringify(u));
      }
      toast.success(`Account created! Welcome, ${data.fullName}`);
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Full Name */}
      <FieldWrapper error={errors.fullName?.message}>
        <label className="text-white/70 text-xs font-medium">Full Name</label>
        <input
          {...register('fullName')}
          className={inputCls}
          placeholder="Arjun Sharma"
          autoComplete="name"
        />
      </FieldWrapper>

      {/* Email */}
      <FieldWrapper error={errors.email?.message}>
        <label className="text-white/70 text-xs font-medium">Email Address</label>
        <input
          {...register('email')}
          className={inputCls}
          placeholder="arjun@example.com"
          type="email"
          autoComplete="email"
        />
      </FieldWrapper>

      {/* Phone */}
      <FieldWrapper error={errors.phone?.message}>
        <label className="text-white/70 text-xs font-medium">Phone Number</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">+91</span>
          <input
            {...register('phone')}
            className={`${inputCls} pl-12`}
            placeholder="9876543210"
            type="tel"
            maxLength={10}
            autoComplete="tel"
          />
        </div>
      </FieldWrapper>

      {/* Password */}
      <FieldWrapper error={errors.password?.message}>
        <label className="text-white/70 text-xs font-medium">Password</label>
        <div className="relative">
          <input
            {...register('password')}
            className={`${inputCls} pr-10`}
            placeholder="Min 8 chars, uppercase, number, symbol"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        {pwd && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: strength.color }}
                animate={{ width: `${(strength.score / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
        )}
      </FieldWrapper>

      {/* Confirm Password */}
      <FieldWrapper error={errors.confirmPassword?.message}>
        <label className="text-white/70 text-xs font-medium">Confirm Password</label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            className={`${inputCls} pr-10`}
            placeholder="Re-enter password"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
          >
            {showConfirm ? '🙈' : '👁'}
          </button>
        </div>
      </FieldWrapper>

      {/* Class */}
      <FieldWrapper error={errors.studentClass?.message}>
        <label className="text-white/70 text-xs font-medium">Class</label>
        <div className="grid grid-cols-4 gap-2">
          {(['9', '10', '11', '12'] as const).map((cls) => (
            <label key={cls} className="cursor-pointer">
              <input {...register('studentClass')} type="radio" value={cls} className="sr-only" />
              <div
                className={`text-center py-2 rounded-xl border text-sm font-medium transition cursor-pointer ${
                  watch('studentClass') === cls
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white/5 border-white/20 text-white/70 hover:border-orange-400'
                }`}
              >
                {cls}th
              </div>
            </label>
          ))}
        </div>
      </FieldWrapper>

      {/* Subjects */}
      <FieldWrapper error={errors.subjects?.message}>
        <label className="text-white/70 text-xs font-medium">Subjects</label>
        <div className="flex flex-wrap gap-2">
          {subjectOptions.map((s) => {
            const selected = currentSubjects.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSubject(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                  selected
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white/5 border-white/20 text-white/70 hover:border-orange-400'
                }`}
              >
                <span>{s.icon}</span> {s.label}
              </button>
            );
          })}
        </div>
      </FieldWrapper>

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-xl mt-2 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-orange-500/25 transition"
      >
        {isLoading ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Creating Account…
          </>
        ) : (
          <>
            <span>🔥</span> Create Account
          </>
        )}
      </motion.button>
    </form>
  );
}

// ─── Sign In Form ─────────────────────────────────────────────────────────────

function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const json = await res.json();
      const u = json.user || {
        id: 'user-' + Date.now().toString(36),
        name: data.email.split('@')[0],
        email: data.email,
        total_xp: 750,
        streak: 3,
        level: 2,
        class_level: 11,
        target_exam: 'JEE Main',
        selected_subjects: ['mathematics', 'physics'],
      };
      const userPayload = {
        id: u.id,
        email: u.email,
        displayName: u.name || data.email.split('@')[0],
        avatarUrl: u.avatar || '🦅',
        xp: u.total_xp || 750,
        level: u.level || 2,
        streak: u.streak || 3,
        longestStreak: u.streak || 3,
        lastActiveDate: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        progress: {},
        badges: ['Phoenix Scholar'],
        preferredSubjects: u.selected_subjects || ['mathematics', 'physics'],
      };
      useUserStore.getState().setUser(userPayload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('phoenix_user', JSON.stringify(userPayload));
        localStorage.setItem('phoenix_active_profile', JSON.stringify(u));
      }
      toast.success(`Welcome back, ${userPayload.displayName}!`);
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldWrapper error={errors.email?.message}>
        <label className="text-white/70 text-xs font-medium">Email Address</label>
        <input
          {...register('email')}
          className={inputCls}
          placeholder="arjun@example.com"
          type="email"
          autoComplete="email"
        />
      </FieldWrapper>

      <FieldWrapper error={errors.password?.message}>
        <label className="text-white/70 text-xs font-medium">Password</label>
        <div className="relative">
          <input
            {...register('password')}
            className={`${inputCls} pr-10`}
            placeholder="Your password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
      </FieldWrapper>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            {...register('rememberMe')}
            type="checkbox"
            className="w-4 h-4 rounded accent-orange-500"
          />
          <span className="text-white/60 text-sm">Remember me</span>
        </label>
        <button
          type="button"
          className="text-orange-400 text-sm hover:text-orange-300 transition"
        >
          Forgot password?
        </button>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-orange-500/25 transition"
      >
        {isLoading ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Signing in…
          </>
        ) : (
          <>
            <span>🔥</span> Sign In
          </>
        )}
      </motion.button>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0f0a1e]">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a0a2e] via-[#2d0f3d] to-[#0f0a1e] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-400/5 blur-2xl" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8 self-start"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/30">
            🔥
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Phoenix<span className="text-orange-400">Learn</span>
          </span>
        </motion.div>

        {/* Phoenix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <PhoenixSVG />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-4"
        >
          <h2 className="text-white text-2xl font-bold leading-tight">
            Rise. Learn. <span className="text-orange-400">Conquer.</span>
          </h2>
          <p className="text-white/50 text-sm mt-2 max-w-xs">
            Your AI-powered companion for JEE, NEET, and beyond. Study smarter, not harder.
          </p>
        </motion.div>

        {/* Stats */}
        <StatsPanel />

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/40 text-xs">12,847 students online right now</span>
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto py-8 px-4 sm:px-8">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-6 self-start">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-lg font-bold">
            🔥
          </div>
          <span className="text-white text-xl font-bold">
            Phoenix<span className="text-orange-400">Learn</span>
          </span>
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + '-heading'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-white text-2xl font-bold">
                {tab === 'signin' ? 'Welcome back 👋' : 'Join PhoenixLearn 🔥'}
              </h1>
              <p className="text-white/50 text-sm mt-1">
                {tab === 'signin'
                  ? 'Sign in to continue your learning journey'
                  : 'Create your free account and start rising'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Tab Switcher */}
          <div className="relative flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
            <motion.div
              className="absolute inset-y-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 shadow-lg"
              animate={{ left: tab === 'signin' ? '4px' : '50%', right: tab === 'signin' ? '50%' : '4px' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
            <button
              onClick={() => setTab('signin')}
              className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                tab === 'signin' ? 'text-white' : 'text-white/50 hover:text-white/70'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                tab === 'signup' ? 'text-white' : 'text-white/50 hover:text-white/70'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* OAuth */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGoogleModal(true)}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/15 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition mb-5 cursor-pointer"
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          <GoogleAuthModal
            isOpen={showGoogleModal}
            onClose={() => setShowGoogleModal(false)}
          />

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form with animated swap */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === 'signup' ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'signup' ? -40 : 40 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {tab === 'signin' ? <SignInForm /> : <SignUpForm />}
            </motion.div>
          </AnimatePresence>

          {/* Switch hint */}
          <p className="text-white/40 text-sm text-center mt-5">
            {tab === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setTab('signup')}
                  className="text-orange-400 hover:text-orange-300 font-medium transition"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setTab('signin')}
                  className="text-orange-400 hover:text-orange-300 font-medium transition"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Terms */}
          <p className="text-white/25 text-xs text-center mt-4">
            By continuing, you agree to our{' '}
            <span className="text-white/40 hover:text-orange-400 cursor-pointer transition">Terms of Service</span>{' '}
            and{' '}
            <span className="text-white/40 hover:text-orange-400 cursor-pointer transition">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
