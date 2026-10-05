import { NextResponse } from 'next/server';
import { createSupabaseServerClient, backendErrorResponse } from '@/lib/supabase-server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
