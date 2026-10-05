'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserStore } from '@/hooks/useUser';

export default function AuthCallbackSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const completeSignIn = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const result = await response.json();
        if (!response.ok || !result.user) {
          throw new Error(result.error || 'Unable to load your profile.');
        }
        if (!active) return;
        const profile = result.user;
        const user = {
          id: profile.id,
          email: profile.email,
          displayName: profile.name,
          avatarUrl: profile.avatar_url || profile.avatar || '🦅',
          xp: profile.total_xp ?? 0,
          level: profile.level ?? 1,
          streak: profile.streak ?? 0,
          longestStreak: profile.longest_streak ?? profile.streak ?? 0,
          lastActiveDate: null,
          joinedAt: profile.created_at ?? new Date().toISOString(),
          progress: {},
          badges: [],
          preferredSubjects: profile.selected_subjects ?? [],
        };
        useUserStore.getState().setUser(user);
        localStorage.setItem('phoenix_user', JSON.stringify(user));
        localStorage.setItem('phoenix_active_profile', JSON.stringify(profile));
        router.replace('/dashboard');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Google sign-in failed.');
        router.replace('/auth');
      }
    };

    void completeSignIn();
    return () => {
      active = false;
    };
  }, [router]);

  return <main className="min-h-screen flex items-center justify-center text-white">Completing sign-in…</main>;
}
