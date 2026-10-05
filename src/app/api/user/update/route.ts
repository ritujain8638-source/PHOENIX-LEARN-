import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser, profileFromAuthUser, backendErrorResponse } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updates = body?.updates;
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return NextResponse.json({ error: 'Profile updates are required.' }, { status: 400 });
    }

    const allowedFields = ['name', 'avatar', 'avatar_url', 'class_level', 'phone', 'target_exam', 'selected_subjects', 'leaderboard_opt_in'] as const;
    const sanitized: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in updates) sanitized[field] = updates[field];
    }
    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: 'No supported profile fields were provided.' }, { status: 400 });
    }
    if ('name' in sanitized && (typeof sanitized.name !== 'string' || sanitized.name.trim().length < 2 || sanitized.name.length > 120)) {
      return NextResponse.json({ error: 'Name must be between 2 and 120 characters.' }, { status: 400 });
    }
    if ('class_level' in sanitized && (!Number.isInteger(sanitized.class_level) || Number(sanitized.class_level) < 9 || Number(sanitized.class_level) > 12)) {
      return NextResponse.json({ error: 'Class must be between 9 and 12.' }, { status: 400 });
    }
    if ('leaderboard_opt_in' in sanitized && typeof sanitized.leaderboard_opt_in !== 'boolean') {
      return NextResponse.json({ error: 'leaderboard_opt_in must be a boolean.' }, { status: 400 });
    }
    if ('selected_subjects' in sanitized && (
      !Array.isArray(sanitized.selected_subjects) ||
      sanitized.selected_subjects.length < 1 ||
      sanitized.selected_subjects.length > 12 ||
      sanitized.selected_subjects.some((subject) => typeof subject !== 'string' || !subject.trim() || subject.length > 80)
    )) {
      return NextResponse.json({ error: 'selected_subjects must contain 1 to 12 valid subject IDs.' }, { status: 400 });
    }
    for (const field of ['avatar', 'avatar_url', 'phone', 'target_exam'] as const) {
      if (field in sanitized && (typeof sanitized[field] !== 'string' || sanitized[field].length > 500)) {
        return NextResponse.json({ error: `${field} must be a string of at most 500 characters.` }, { status: 400 });
      }
    }
    if ('avatar_url' in sanitized && sanitized.avatar_url !== '') {
      try {
        if (new URL(String(sanitized.avatar_url)).protocol !== 'https:') throw new Error('Invalid avatar URL');
      } catch {
        return NextResponse.json({ error: 'avatar_url must be a valid HTTPS URL.' }, { status: 400 });
      }
    }
    if ('phone' in sanitized && typeof sanitized.phone === 'string') {
      sanitized.phone = sanitized.phone.trim();
    }
    if ('target_exam' in sanitized && typeof sanitized.target_exam === 'string') {
      sanitized.target_exam = sanitized.target_exam.trim();
    }

    const { supabase, user } = await requireAuthenticatedUser();
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...sanitized,
        ...(typeof sanitized.name === 'string' ? { name: sanitized.name.trim() } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('*')
      .single();
    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      user: profileFromAuthUser(user, profile),
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
