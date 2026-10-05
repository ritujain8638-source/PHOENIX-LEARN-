import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function PATCH(req: NextRequest) {
  try {
    let body: { ids?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }
    if (
      !Array.isArray(body.ids) ||
      body.ids.length > 50 ||
      body.ids.some((id) => !(typeof id === 'string' && /^\d+$/.test(id)) && !(Number.isInteger(id) && Number(id) > 0))
    ) {
      return NextResponse.json({ error: 'ids must be a list of up to 50 notification ids.' }, { status: 400 });
    }
    if (body.ids.length === 0) return NextResponse.json({ success: true, updated: 0 });

    const ids = body.ids.map(Number);
    const { supabase, user } = await requireAuthenticatedUser();
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .in('id', ids)
      .select('id');
    if (error) throw error;
    return NextResponse.json({ success: true, updated: data?.length ?? 0 });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
