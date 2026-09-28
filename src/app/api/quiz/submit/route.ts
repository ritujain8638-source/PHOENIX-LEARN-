import { NextRequest, NextResponse } from 'next/server';
import { getUserById, saveUser } from '@/lib/server-state';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id = 'user-demo-1', topic_id = 'math-t9', score_percent = 80, time_spent_seconds = 120 } = body;

    const user = getUserById(user_id);
    const xpGained = Math.round((Number(score_percent) / 100) * 150 + 25);

    if (user) {
      user.total_xp += xpGained;
      saveUser(user);
    }

    return NextResponse.json({
      success: true,
      mastery: Math.min(100, Math.round(Number(score_percent) * 0.9 + 10)),
      xp_gained: xpGained,
      streak_updated: true,
      message: score_percent >= 80 ? 'Mastery unlocked! Phoenix level increased!' : 'Great effort! Review the suggested practice problems.',
      diagnosis: {
        weak_concepts: score_percent < 70 ? ['Review Vieta relations for higher degree equations'] : [],
        strengths: ['Analytical calculation', 'Speed and accuracy'],
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
