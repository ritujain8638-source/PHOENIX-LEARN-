import { NextRequest, NextResponse } from 'next/server';

const mockNotifications = [
  {
    id: 'n-1',
    type: 'streak',
    title: '🔥 Daily Streak Shield Active',
    message: 'You have maintained a 7-day study streak! Solve today\'s 5-minute quiz to keep it burning.',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'n-2',
    type: 'contest',
    title: '🏆 Calculus Grand Clash Tonight',
    message: 'Math Arena begins at 8:00 PM IST with 1,000 XP up for grabs. Be prepared!',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'n-3',
    type: 'recommendation',
    title: '🧠 Targeted Gap Detected',
    message: 'Phoenix identified a weakness in Complex Numbers (Argand Plane). Tap to review the 3-minute summary.',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export async function GET() {
  return NextResponse.json({ notifications: mockNotifications });
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ success: true });
}
