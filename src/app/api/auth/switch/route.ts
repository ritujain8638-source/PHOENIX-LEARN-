import { NextRequest, NextResponse } from 'next/server';
import { getUserById, setActiveUserId } from '@/lib/server-state';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = getUserById(user_id);
    if (!user) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    setActiveUserId(user.id);

    return NextResponse.json({
      success: true,
      message: `Switched to profile: ${user.name}`,
      user,
      learning_state: {
        active_gaps: [],
        topics_in_progress: 3,
        suggested_next_topic: 'math-t9',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
