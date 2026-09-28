import { NextRequest, NextResponse } from 'next/server';
import { getActiveUserId, getUserById } from '@/lib/server-state';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id') || getActiveUserId();

  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user,
    learning_state: {
      active_gaps: [
        {
          id: 'gap-1',
          topic_id: 'math-t6',
          misconception: 'Difficulty with principal argument calculation when real part is negative in Argand Plane',
          severity: 42,
          recommendation: 'Review RD Sharma Section 13.4 and practice 5 Argand plane quadrant tests',
        },
        {
          id: 'gap-2',
          topic_id: 'phy-t4',
          misconception: 'Confusion between threshold static friction (μ_s N) and actual static resistance force',
          severity: 48,
          recommendation: 'Interactive experiment in Physics Lab with normal load variations',
        }
      ],
      topics_in_progress: 3,
      suggested_next_topic: 'math-t9',
    },
  });
}
