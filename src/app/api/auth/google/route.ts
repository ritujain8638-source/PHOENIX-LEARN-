import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, backendErrorResponse } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const redirectTo = new URL('/auth/callback', req.url).toString();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data.url) {
      return NextResponse.json({ error: 'Google sign-in URL could not be created.' }, { status: 502 });
    }

    return NextResponse.json({ authorization_url: data.url });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
