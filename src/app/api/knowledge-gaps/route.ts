import { NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { supabase, user } = await requireAuthenticatedUser();
    const [{ data: gaps, error: gapsError }, { data: progress, error: progressError }] = await Promise.all([
      supabase
        .from('knowledge_gaps')
        .select('id,topic_id,misconception_summary,mastery_level,suggested_intervention,status,identified_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('identified_at', { ascending: false }),
      supabase.from('user_progress').select('mastery,is_completed').eq('user_id', user.id),
    ]);
    if (gapsError) throw gapsError;
    if (progressError) throw progressError;

    const records = progress ?? [];
    return NextResponse.json({
      active_gaps: (gaps ?? []).map((gap) => ({
        ...gap,
        misconception: gap.misconception_summary,
        severity: gap.mastery_level,
        recommendation: gap.suggested_intervention,
      })),
      mastered_count: records.filter((record) => record.is_completed || record.mastery >= 80).length,
      in_progress_count: records.filter((record) => !record.is_completed && record.mastery < 80).length,
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
