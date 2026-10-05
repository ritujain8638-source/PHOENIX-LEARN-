import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topicId = body.topicId ?? body.topic_id;
    const score = Number(body.score);
    const timeSpentSeconds = Number(body.timeSpentSeconds ?? body.time_spent_seconds ?? 0);

    if (typeof topicId !== 'string' || !topicId.trim() || topicId.length > 160) {
      return NextResponse.json({ error: 'topicId is required.' }, { status: 400 });
    }
    if (!Number.isFinite(score) || score < 0 || score > 100 || !Number.isInteger(timeSpentSeconds) || timeSpentSeconds < 0 || timeSpentSeconds > 604800) {
      return NextResponse.json({ error: 'Score or time spent is invalid.' }, { status: 400 });
    }

    const { supabase } = await requireAuthenticatedUser();
    const { data, error } = await supabase.rpc('save_topic_progress', {
      p_topic_id: topicId.trim(),
      p_score: Math.round(score),
      p_time_spent_seconds: timeSpentSeconds,
    });
    if (error) throw error;

    return NextResponse.json({
      success: true,
      topicId: data.topic_id,
      mastery: data.mastery,
      savedAt: data.last_studied,
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
