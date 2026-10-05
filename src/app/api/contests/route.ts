import { NextResponse } from 'next/server';
import { createSupabaseServerClient, backendErrorResponse } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const [{ data: contests, error: contestsError }, { data: leaderboard, error: leaderboardError }] =
      await Promise.all([
        supabase
          .from('contests')
          .select('id,title,subject,start_time,duration_minutes,prize_pool')
          .order('start_time', { ascending: true }),
        supabase
          .from('leaderboard')
          .select('rank,name,class_level,xp,streak,avatar,tier')
          .order('rank', { ascending: true }),
      ]);
    if (contestsError) throw contestsError;
    if (leaderboardError) throw leaderboardError;

    const now = Date.now();
    return NextResponse.json({
      contests: (contests ?? []).map((contest) => {
        const startsAt = new Date(contest.start_time).getTime();
        const endsAt = startsAt + contest.duration_minutes * 60_000;
        return {
          ...contest,
          status: now < startsAt ? 'upcoming' : now < endsAt ? 'live' : 'past',
          participants_count: 0,
        };
      }),
      leaderboard: leaderboard ?? [],
    });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
