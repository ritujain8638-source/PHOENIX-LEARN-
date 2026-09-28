import { NextResponse } from 'next/server';
import { getProfiles, getActiveUserId } from '@/lib/server-state';

export async function GET() {
  const profiles = getProfiles();
  const activeId = getActiveUserId();
  return NextResponse.json({
    profiles,
    active_user_id: activeId,
    count: profiles.length,
  });
}
