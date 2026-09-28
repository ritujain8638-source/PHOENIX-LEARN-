import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    active_gaps: [
      {
        id: 'gap-1',
        topic_id: 'math-t6',
        topic_name: 'Complex Numbers & De Moivre',
        subject: 'mathematics',
        misconception: 'Difficulty with principal argument calculation when real part is negative in Argand Plane',
        severity: 42,
        recommendation: 'Review RD Sharma Section 13.4 and practice 5 Argand plane quadrant tests',
        status: 'active',
      },
      {
        id: 'gap-2',
        topic_id: 'phy-t4',
        topic_name: 'Laws of Motion & Friction',
        subject: 'physics',
        misconception: 'Confusion between threshold static friction (μ_s N) and actual static resistance force',
        severity: 48,
        recommendation: 'Interactive experiment in Physics Lab with normal load variations',
        status: 'active',
      },
    ],
    mastered_count: 14,
    in_progress_count: 5,
  });
}
