import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, profileFromAuthUser, backendErrorResponse } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
      return NextResponse.json({ error: 'A valid email and password are required.' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
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
