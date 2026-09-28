import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser, setActiveUserId, UserProfile } from '@/lib/server-state';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email;
    const name = body.name || 'Google Scholar';
    const avatar = body.avatar_url || body.picture || '🦅';
    const googleId = body.google_id || body.sub || `g-${Date.now()}`;

    if (!email) {
      return NextResponse.json({ error: 'Google email is required' }, { status: 400 });
    }

    let existing = getUserByEmail(email);
    if (!existing) {
      existing = {
        id: `user-${Date.now().toString(36)}`,
        name,
        email,
        avatar,
        class_level: 11,
        target_exam: 'JEE Main & Advanced',
        selected_subjects: ['mathematics', 'physics', 'chemistry'],
        total_xp: 500,
        streak: 1,
        level: 1,
        created_at: new Date().toISOString(),
      };
      saveUser(existing);
    }

    setActiveUserId(existing.id);

    return NextResponse.json({
      success: true,
      message: `Welcome, ${existing.name}!`,
      user: existing,
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
