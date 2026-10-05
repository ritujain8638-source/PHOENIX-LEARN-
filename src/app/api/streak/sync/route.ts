import { NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function POST() {
  try {
    const { supabase } = await requireAuthenticatedUser();
    const { data, error } = await supabase.rpc('sync_user_streak');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return backendErrorResponse(error);
  }
}
