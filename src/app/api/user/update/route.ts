import { NextRequest, NextResponse } from 'next/server';
import { getUserById, saveUser } from '@/lib/server-state';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, updates = {} } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = getUserById(user_id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = saveUser({ ...user, ...updates });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
