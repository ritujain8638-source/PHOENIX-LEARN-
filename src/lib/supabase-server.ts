import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

export class BackendConfigurationError extends Error {}
export class AuthenticationError extends Error {}

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new BackendConfigurationError(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new AuthenticationError('Sign in to continue.');
  }

  return { supabase, user: data.user };
}

export function profileFromAuthUser(user: User, profile?: Record<string, unknown> | null) {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    name: profile?.name ?? metadata.name ?? user.email?.split('@')[0] ?? 'Phoenix Scholar',
    email: user.email ?? '',
    avatar: profile?.avatar ?? metadata.avatar ?? '🦅',
    avatar_url: profile?.avatar_url ?? metadata.avatar_url ?? null,
    class_level: profile?.class_level ?? metadata.class_level ?? 11,
    phone: profile?.phone ?? metadata.phone ?? '',
    target_exam: profile?.target_exam ?? metadata.target_exam ?? 'JEE Main & Advanced',
    selected_subjects: profile?.selected_subjects ?? metadata.selected_subjects ?? ['mathematics', 'physics', 'chemistry'],
    total_xp: profile?.total_xp ?? 0,
    streak: profile?.streak ?? 0,
    longest_streak: profile?.longest_streak ?? 0,
    leaderboard_opt_in: profile?.leaderboard_opt_in ?? false,
    level: profile?.level ?? 1,
    created_at: profile?.created_at ?? user.created_at,
  };
}

export function backendErrorResponse(error: unknown) {
  if (error instanceof BackendConfigurationError) {
    return Response.json({ error: error.message }, { status: 503 });
  }
  if (error instanceof AuthenticationError) {
    return Response.json({ error: error.message }, { status: 401 });
  }

  console.error('[API] Request failed:', error);
  return Response.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
}
