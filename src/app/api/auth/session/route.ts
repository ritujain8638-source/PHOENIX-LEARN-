import { NextResponse } from 'next/server';
import { requireAuthenticatedUser, profileFromAuthUser, backendErrorResponse } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { supabase, user } = await requireAuthenticatedUser();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return NextResponse.json({ user: profileFromAuthUser(user, profile) });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
