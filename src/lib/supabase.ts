// ─────────────────────────────────────────────
//  PhoenixLearn – Supabase Client Setup
// ─────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Public Supabase client – safe to use in the browser.
 * Uses the anonymous key which respects Row Level Security (RLS).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Admin Supabase client – server-side ONLY (bypasses RLS).
 * NEVER expose this in client-side bundles.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ── Type-Safe DB Helpers ──────────────────────

/**
 * Fetches a user profile by ID from the `profiles` table.
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[Supabase] getUserProfile error:', error.message);
    return null;
  }
  return data;
}

/**
 * Upserts a user profile in the `profiles` table.
 */
export async function upsertUserProfile(profile: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] upsertUserProfile error:', error.message);
    return null;
  }
  return data;
}

/**
 * Fetches user progress records for a given user and subject.
 */
export async function getUserProgress(userId: string, subjectId?: string) {
  let query = supabase.from('user_progress').select('*').eq('user_id', userId);

  if (subjectId) {
    query = query.eq('subject_id', subjectId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[Supabase] getUserProgress error:', error.message);
    return [];
  }
  return data;
}

/**
 * Records a completed topic for a user.
 */
export async function markTopicComplete(
  userId: string,
  topicId: string,
  subjectId: string,
  xpEarned: number
) {
  const { error } = await supabase.from('topic_completions').upsert(
    {
      user_id: userId,
      topic_id: topicId,
      subject_id: subjectId,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,topic_id' }
  );

  if (error) {
    console.error('[Supabase] markTopicComplete error:', error.message);
    return false;
  }
  return true;
}

/**
 * Saves a quiz result to the `quiz_results` table.
 */
export async function saveQuizResult(result: {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  xpEarned: number;
}) {
  const { error } = await supabase.from('quiz_results').insert({
    user_id: result.userId,
    quiz_id: result.quizId,
    score: result.score,
    total_questions: result.totalQuestions,
    correct_answers: result.correctAnswers,
    time_taken: result.timeTaken,
    xp_earned: result.xpEarned,
    completed_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[Supabase] saveQuizResult error:', error.message);
    return false;
  }
  return true;
}

/**
 * Fetches the contest leaderboard for a given contest ID.
 */
export async function getContestLeaderboard(contestId: string, limit = 50) {
  const { data, error } = await supabase
    .from('contest_entries')
    .select('*, profiles(name, avatar)')
    .eq('contest_id', contestId)
    .order('score', { ascending: false })
    .order('time_taken', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[Supabase] getContestLeaderboard error:', error.message);
    return [];
  }
  return data;
}

/**
 * Subscribes to real-time contest leaderboard updates.
 * Returns the subscription channel (call .unsubscribe() on cleanup).
 */
export function subscribeToContest(
  contestId: string,
  onUpdate: (payload: unknown) => void
) {
  const channel = supabase
    .channel(`contest-${contestId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contest_entries',
        filter: `contest_id=eq.${contestId}`,
      },
      onUpdate
    )
    .subscribe();

  return channel;
}

/**
 * Saves a chat message to the `chat_sessions` table.
 */
export async function saveChatMessage(
  sessionId: string,
  message: { role: string; content: string; timestamp: string }
) {
  const { error } = await supabase.from('chat_messages').insert({
    session_id: sessionId,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp,
  });

  if (error) {
    console.error('[Supabase] saveChatMessage error:', error.message);
    return false;
  }
  return true;
}

/**
 * Increments a user's XP and updates their level.
 */
export async function addXPToUser(userId: string, xpAmount: number) {
  const { data, error } = await supabase.rpc('increment_user_xp', {
    p_user_id: userId,
    p_xp_amount: xpAmount,
  });

  if (error) {
    console.error('[Supabase] addXPToUser error:', error.message);
    return null;
  }
  return data;
}

/**
 * Fetches all notifications for a user, ordered by newest first.
 */
export async function getUserNotifications(userId: string, unreadOnly = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[Supabase] getUserNotifications error:', error.message);
    return [];
  }
  return data;
}

/**
 * Marks a notification as read.
 */
export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('[Supabase] markNotificationRead error:', error.message);
    return false;
  }
  return true;
}

/**
 * Updates the user's streak count and last_active timestamp.
 */
export async function updateUserStreak(userId: string, streak: number) {
  const { error } = await supabase
    .from('profiles')
    .update({
      streak,
      last_active: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('[Supabase] updateUserStreak error:', error.message);
    return false;
  }
  return true;
}
