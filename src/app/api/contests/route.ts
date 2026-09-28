import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    contests: [
      {
        id: 'c-1',
        title: 'Phoenix Weekly Blitz #42',
        subject: 'Mathematics & Physics',
        start_time: '2026-10-02T18:00:00Z',
        duration_minutes: 60,
        participants_count: 1420,
        prize_pool: '5000 XP + Top Rank Badge',
      },
      {
        id: 'c-2',
        title: 'JEE Advanced Sprint Simulation',
        subject: 'All Subjects',
        start_time: '2026-10-05T10:00:00Z',
        duration_minutes: 180,
        participants_count: 3100,
        prize_pool: '15000 XP + AIR Predictor',
      }
    ],
    leaderboard: [
      { rank: 1, name: 'Aarav Sharma', class_level: 'Class 12', xp: 14500, streak: 42, avatar: '🦅', tier: 'Phoenix Sovereign' },
      { rank: 2, name: 'Diya Patel', class_level: 'Class 12', xp: 13920, streak: 35, avatar: '⚡', tier: 'Solar Blaze' },
      { rank: 3, name: 'Rohan Verma', class_level: 'Class 11', xp: 12840, streak: 28, avatar: '🔥', tier: 'Crimson Wing' },
      { rank: 4, name: 'Ananya Deshmukh', class_level: 'Class 12', xp: 11200, streak: 21, avatar: '✨', tier: 'Rising Ember' },
      { rank: 5, name: 'Kabir Mehta', class_level: 'Class 10', xp: 9800, streak: 19, avatar: '🌟', tier: 'Rising Ember' },
    ],
  });
}
