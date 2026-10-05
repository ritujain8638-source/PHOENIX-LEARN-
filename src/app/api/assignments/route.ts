import { NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { supabase, user } = await requireAuthenticatedUser();
    const { data, error } = await supabase
      .from('assignments')
      .select('id,title,subject,chapter,due_date,urgency,total_questions,completed_questions,status,xp_reward')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ assignments: data ?? [] });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
