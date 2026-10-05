import { NextRequest, NextResponse } from 'next/server';

interface GeneratedQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  tags: string[];
}

function parseGeneratedQuestions(raw: string, topic: string, difficulty: string): GeneratedQuestion[] {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed: unknown = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error('Gemini returned a non-array question response.');

  return parsed.flatMap((question, index) => {
    if (!question || typeof question !== 'object') return [];
    const candidate = question as Partial<GeneratedQuestion>;
    if (
      typeof candidate.text !== 'string' ||
      !candidate.text.trim() ||
      !Array.isArray(candidate.options) ||
      candidate.options.length !== 4 ||
      !candidate.options.every((option) => typeof option === 'string' && option.trim()) ||
      !Number.isInteger(candidate.correctAnswer) ||
      candidate.correctAnswer! < 0 ||
      candidate.correctAnswer! > 3 ||
      typeof candidate.explanation !== 'string'
    ) {
      return [];
    }
    return [{
      id: typeof candidate.id === 'string' ? candidate.id : `question-${index + 1}`,
      text: candidate.text,
      options: candidate.options,
      correctAnswer: candidate.correctAnswer!,
      explanation: candidate.explanation,
      difficulty,
      tags: Array.isArray(candidate.tags) ? candidate.tags.filter((tag): tag is string => typeof tag === 'string') : [topic],
    }];
  });
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const difficulty = body.difficulty ?? 'medium';
    const count = body.count ?? 5;
    const type = body.type ?? 'mcq';
    if (!topic || topic.length > 160 || !subject || subject.length > 80) {
      return NextResponse.json({ error: 'A topic and subject within the allowed length are required.' }, { status: 400 });
    }
    if (!['easy', 'medium', 'hard', 'jee'].includes(String(difficulty))) {
      return NextResponse.json({ error: 'difficulty must be easy, medium, hard, or jee.' }, { status: 400 });
    }
    if (!Number.isInteger(count) || Number(count) < 1 || Number(count) > 10) {
      return NextResponse.json({ error: 'count must be an integer between 1 and 10.' }, { status: 400 });
    }
    if (type !== 'mcq') {
      return NextResponse.json({ error: 'Only mcq question generation is supported.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Question generation is not configured on this server.' }, { status: 503 });
    }

    const prompt = `Generate ${count} ${difficulty} difficulty multiple-choice questions for a Class 11-12 student studying ${subject}, specifically "${topic}". Return only a JSON array. Each item must have: text, options (exactly four strings), correctAnswer (zero-based integer from 0 to 3), explanation, and tags (string array). Include correct, educational solutions; use LaTeX for math.`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    let response: Response;
    try {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 4096, responseMimeType: 'application/json' },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      console.error('[Questions] Gemini request failed:', response.status);
      return NextResponse.json({ error: 'Question generation service is temporarily unavailable.' }, { status: 502 });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json({ error: 'Question generation returned no content.' }, { status: 502 });
    }
    const questions = parseGeneratedQuestions(rawText, topic, String(difficulty)).slice(0, Number(count));
    if (questions.length === 0) {
      return NextResponse.json({ error: 'Question generation returned no valid questions.' }, { status: 502 });
    }
    return NextResponse.json({ questions });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Question generation timed out. Please try again.' }, { status: 504 });
    }
    console.error('[Questions] Request failed:', error);
    return NextResponse.json({ error: 'Unable to generate questions right now.' }, { status: 502 });
  }
}
