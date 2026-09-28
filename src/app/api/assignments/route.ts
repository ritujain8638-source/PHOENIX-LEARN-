import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    assignments: [
      {
        id: 'asg-1',
        title: 'RD Sharma Class 11 — Permutations & Combinations Problem Set 16.2',
        subject: 'mathematics',
        due_date: 'Tomorrow, 11:59 PM',
        urgency: 'high',
        total_questions: 15,
        completed_questions: 9,
      },
      {
        id: 'asg-2',
        title: 'HC Verma Vol 1 — Friction Worked Examples & Numerical Problems 1–20',
        subject: 'physics',
        due_date: 'In 3 days',
        urgency: 'medium',
        total_questions: 20,
        completed_questions: 5,
      },
      {
        id: 'asg-3',
        title: 'Chemical Bonding & Molecular Orbital Theory Flash Drills',
        subject: 'chemistry',
        due_date: 'In 5 days',
        urgency: 'low',
        total_questions: 10,
        completed_questions: 0,
      }
    ],
  });
}
