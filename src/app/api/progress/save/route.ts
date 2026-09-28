import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, topicId, score, timeSpentSeconds, mastery } = body;
    return NextResponse.json({
      success: true,
      topicId,
      mastery: mastery || 100,
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
