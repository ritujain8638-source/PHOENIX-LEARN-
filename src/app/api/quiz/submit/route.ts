import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topicId = body.topic_id ?? body.topicId;
    const score = Number(body.score_percent ?? body.score);
    const timeSpentSeconds = Number(body.time_spent_seconds ?? body.timeSpentSeconds ?? 0);
    const responses = body.responses ?? [];

    if (typeof topicId !== 'string' || !topicId.trim() || topicId.length > 160) {
      return NextResponse.json({ error: 'topic_id is required.' }, { status: 400 });
    }
    if (!Number.isFinite(score) || score < 0 || score > 100 || !Number.isInteger(timeSpentSeconds) || timeSpentSeconds < 0 || timeSpentSeconds > 86400) {
      return NextResponse.json({ error: 'Quiz score or time spent is invalid.' }, { status: 400 });
    }
    if (!Array.isArray(responses)) {
      return NextResponse.json({ error: 'responses must be an array.' }, { status: 400 });
    }
    if (JSON.stringify(responses).length > 50_000) {
      return NextResponse.json({ error: 'Quiz responses exceed the maximum allowed size.' }, { status: 413 });
    }

    const { supabase } = await requireAuthenticatedUser();
    const { data, error } = await supabase.rpc('record_quiz_submission', {
      p_topic_id: topicId.trim(),
      p_score_percent: Math.round(score),
      p_time_spent_seconds: timeSpentSeconds,
      p_responses: responses,
    });
    if (error) throw error;

    return NextResponse.json({
      ...data,
      mastery: data.new_mastery,
      xp_gained: data.earned_xp,
      streak_updated: false,
      message: data.new_mastery >= 80
        ? 'Mastery unlocked!'
        : 'Progress saved. Review the suggested practice problems.',
      diagnosis: {
        weak_concepts: data.status === 'gap_detected' ? [topicId] : [],
        strengths: score >= 80 ? ['Strong quiz performance'] : [],
      },
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
