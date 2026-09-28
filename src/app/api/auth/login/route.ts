import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, setActiveUserId } from '@/lib/server-state';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User profile not found with this email' }, { status: 404 });
    }

    setActiveUserId(user.id);

    return NextResponse.json({
      success: true,
      message: `Signed in as ${user.name}`,
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
