import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser, profileFromAuthUser, backendErrorResponse } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supabase, user } = await requireAuthenticatedUser();
    if (body.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only switch to profiles linked to your signed-in account.' },
        { status: 403 }
      );
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Signed in as ${profile.name}`,
      user: profileFromAuthUser(user, profile),
      learning_state: { active_gaps: [], topics_in_progress: 0, suggested_next_topic: null },
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
