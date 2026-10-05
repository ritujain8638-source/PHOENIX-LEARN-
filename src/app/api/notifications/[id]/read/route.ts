import { NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function PATCH(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'Notification id must be an integer.' }, { status: 400 });
    }

    const { supabase, user } = await requireAuthenticatedUser();
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', Number(id))
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
