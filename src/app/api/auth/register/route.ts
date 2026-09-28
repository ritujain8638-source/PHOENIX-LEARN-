import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, saveUser, setActiveUserId, UserProfile } from '@/lib/server-state';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, class_level = 11, phone = '', target_exam = 'JEE Main & Advanced', selected_subjects = ['mathematics', 'physics', 'chemistry'], avatar = '🔥' } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const newUser: UserProfile = {
      id: `user-${Date.now().toString(36)}`,
      name,
      email,
      avatar,
      class_level: Number(class_level),
      phone,
      target_exam,
      selected_subjects: Array.isArray(selected_subjects) ? selected_subjects : ['mathematics', 'physics'],
      total_xp: 250,
      streak: 1,
      level: 1,
      created_at: new Date().toISOString(),
    };

    saveUser(newUser);
    setActiveUserId(newUser.id);

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully!',
      user: newUser,
      learning_state: {
        active_gaps: [],
        topics_in_progress: 1,
        suggested_next_topic: 'math-t1',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
