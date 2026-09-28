import { NextRequest, NextResponse } from 'next/server';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  tags: string[];
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic,
      subject,
      difficulty = 'medium',
      count = 5,
      type = 'mcq',
    } = body;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
      return NextResponse.json({ questions: [], error: 'API key not configured' });
    }

    if (!topic || !subject) {
      return NextResponse.json({ questions: [], error: 'topic and subject are required' });
    }

    // ── Build prompt ─────────────────────────────────────────────────────────
    const prompt = `Generate ${count} ${difficulty} difficulty ${type} questions for a Class 11-12 student studying ${subject} - specifically about "${topic}".

Return as a JSON array with this exact structure:
[
  {
    "id": "q1",
    "text": "question text with LaTeX math where needed using $ for inline and $$ for block",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": 0,
    "explanation": "detailed explanation of why the answer is correct, with step-by-step working",
    "difficulty": "${difficulty}",
    "tags": ["tag1", "tag2"]
  }
]

Guidelines:
- For JEE-level questions, include complex application-based problems with multi-step solutions.
- Make questions challenging but educational.
- Include real-world applications where possible.
- Use LaTeX for all mathematical expressions (inline: $expr$, block: $$expr$$).
- The "correctAnswer" field should be the 0-based index of the correct option.
- options array must always have exactly 4 items.
- Include diverse question types: conceptual, numerical, application-based.

Return ONLY the JSON array, no markdown code fences, no extra text.`;

    // ── Call Gemini API ──────────────────────────────────────────────────────
    const geminiModel = 'gemini-1.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Gemini questions error:', response.status, errText);
      return NextResponse.json({ questions: [] });
    }

    const data = await response.json();

    // ── Extract text ─────────────────────────────────────────────────────────
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) {
      console.warn('Empty response from Gemini questions endpoint');
      return NextResponse.json({ questions: [] });
    }

    // ── Parse JSON ───────────────────────────────────────────────────────────
    try {
      // Strip markdown fences if Gemini adds them despite the instruction
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const questions: Question[] = JSON.parse(cleaned);

      // Basic validation
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      // Sanitize: ensure required fields exist
      const sanitized: Question[] = questions
        .filter((q) => q && typeof q === 'object')
        .map((q, i) => ({
          id: q.id ?? `q${i + 1}`,
          text: q.text ?? '',
          options: Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof q.correctAnswer === 'number'
            ? Math.max(0, Math.min(3, q.correctAnswer))
            : 0,
          explanation: q.explanation ?? '',
          difficulty: q.difficulty ?? difficulty,
          tags: Array.isArray(q.tags) ? q.tags : [topic],
        }));

      return NextResponse.json({ questions: sanitized });
    } catch (parseError) {
      console.error('Failed to parse questions JSON:', parseError);
      console.error('Raw text was:', rawText.slice(0, 500));
      return NextResponse.json({ questions: [] });
    }
  } catch (error) {
    console.error('Questions route error:', error);
    return NextResponse.json({ questions: [] });
  }
}
