import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=oauth_callback_failed', origin));
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[Auth] OAuth callback failed:', error.message);
      return NextResponse.redirect(new URL('/auth?error=oauth_callback_failed', origin));
    }

    return NextResponse.redirect(new URL('/auth/callback/success', origin));
  } catch (error) {
    console.error('[Auth] OAuth callback failed:', error);
    return NextResponse.redirect(new URL('/auth?error=oauth_callback_failed', origin));
  }
}
