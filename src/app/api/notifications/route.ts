import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser, backendErrorResponse } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { supabase, user } = await requireAuthenticatedUser();
    const { data, error } = await supabase
      .from('notifications')
      .select('id,type,title,message,read,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;

    return NextResponse.json({
      notifications: (data ?? []).map((notification) => ({
        ...notification,
        isRead: notification.read,
        createdAt: notification.created_at,
      })),
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const notificationId = body.id;
    if (!Number.isInteger(notificationId) || notificationId < 1) {
      return NextResponse.json({ error: 'A valid notification id is required.' }, { status: 400 });
    }

    const { supabase, user } = await requireAuthenticatedUser();
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
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
