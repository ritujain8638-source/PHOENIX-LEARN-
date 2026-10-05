import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, profileFromAuthUser, backendErrorResponse } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const classLevel = Number(body.class_level ?? 11);
    const selectedSubjects = body.selected_subjects;

    if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid name and email are required.' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 72 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must be 8-72 characters and include an uppercase letter, number, and symbol.' }, { status: 400 });
    }
    if (!Number.isInteger(classLevel) || classLevel < 9 || classLevel > 12) {
      return NextResponse.json({ error: 'Class must be between 9 and 12.' }, { status: 400 });
    }
    if (
      selectedSubjects !== undefined &&
      (!Array.isArray(selectedSubjects) ||
        selectedSubjects.length > 12 ||
        selectedSubjects.length === 0 ||
        selectedSubjects.some((subject: unknown) => typeof subject !== 'string' || !subject.trim() || subject.length > 80))
    ) {
      return NextResponse.json({ error: 'Select at least one valid subject.' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '',
          class_level: classLevel,
          selected_subjects: selectedSubjects ?? ['mathematics', 'physics', 'chemistry'],
        },
      },
    });

    if (error) {
      const isDuplicate = /already registered|already exists/i.test(error.message);
      return NextResponse.json(
        { error: isDuplicate ? 'An account with this email already exists.' : error.message },
        { status: isDuplicate ? 409 : 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Account creation did not return a user.' }, { status: 502 });
    }

    if (!data.session) {
      return NextResponse.json(
        { success: true, requires_email_confirmation: true, message: 'Check your email to confirm your account.' },
        { status: 202 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profileError) throw profileError;

    return NextResponse.json({
      success: true,
      user: profileFromAuthUser(data.user, profile),
      learning_state: { active_gaps: [], topics_in_progress: 0, suggested_next_topic: null },
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
