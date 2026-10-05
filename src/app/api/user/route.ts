import { NextResponse } from 'next/server';
import { requireAuthenticatedUser, profileFromAuthUser, backendErrorResponse } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { supabase, user } = await requireAuthenticatedUser();
    const [{ data: profile, error: profileError }, { data: gaps, error: gapsError }, { data: progress, error: progressError }] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('knowledge_gaps')
          .select('id,topic_id,misconception_summary,mastery_level,suggested_intervention,status,identified_at')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('identified_at', { ascending: false }),
        supabase.from('user_progress').select('topic_id,mastery,is_completed').eq('user_id', user.id),
      ]);

    if (profileError) throw profileError;
    if (gapsError) throw gapsError;
    if (progressError) throw progressError;

    const topics = progress ?? [];
    return NextResponse.json({
      user: profileFromAuthUser(user, profile),
      learning_state: {
        active_gaps: gaps ?? [],
        topics_in_progress: topics.filter((topic) => !topic.is_completed).length,
        suggested_next_topic: topics.find((topic) => !topic.is_completed)?.topic_id ?? null,
      },
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
