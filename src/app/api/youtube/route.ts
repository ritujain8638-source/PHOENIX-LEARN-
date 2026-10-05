import { NextRequest, NextResponse } from 'next/server';

interface VideoRecommendation {
  title: string;
  channel: string;
  searchQuery: string;
  duration: string;
  description: string;
  thumbnail: string;
  reason: string;
}

function parseRecommendations(raw: string, topic: string, subject: string): VideoRecommendation[] {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed: unknown = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error('Gemini returned a non-array video response.');

  return parsed.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const video = item as Partial<VideoRecommendation>;
    if (typeof video.title !== 'string' || typeof video.channel !== 'string' || typeof video.searchQuery !== 'string') {
      return [];
    }
    return [{
      title: video.title,
      channel: video.channel,
      searchQuery: video.searchQuery,
      duration: typeof video.duration === 'string' ? video.duration : 'Duration unavailable',
      description: typeof video.description === 'string' ? video.description : `Learn about ${topic}`,
      thumbnail: typeof video.thumbnail === 'string' && /^https:\/\/(www\.)?youtube\.com\//.test(video.thumbnail)
        ? video.thumbnail
        : '',
      reason: typeof video.reason === 'string' ? video.reason : `Suggested for ${topic} in ${subject}.`,
    }];
  }).slice(0, 3);
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
    const chapter = typeof body.chapter === 'string' ? body.chapter.trim() : '';
    if (!topic || topic.length > 160 || !subject || subject.length > 80 || chapter.length > 120) {
      return NextResponse.json({ error: 'A valid topic and subject are required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Video recommendations are not configured on this server.' }, { status: 503 });
    }

    const prompt = `Recommend 3 reputable educational YouTube videos for a Class 11-12 student learning "${topic}" in ${subject}${chapter ? ` (Chapter: ${chapter})` : ''}. Return only a JSON array with title, channel, searchQuery, duration, description, thumbnail (a real YouTube URL or empty string), and reason. Do not invent exact video IDs; use an empty thumbnail if unknown.`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    let response: Response;
    try {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 2048, responseMimeType: 'application/json' },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      console.error('[YouTube] Gemini request failed:', response.status);
      return NextResponse.json({ error: 'Video recommendation service is temporarily unavailable.' }, { status: 502 });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json({ error: 'Video recommendation service returned no content.' }, { status: 502 });
    }
    const videos = parseRecommendations(rawText, topic, subject);
    if (videos.length === 0) {
      return NextResponse.json({ error: 'Video recommendation service returned no valid recommendations.' }, { status: 502 });
    }
    return NextResponse.json({ videos });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Video recommendation request timed out.' }, { status: 504 });
    }
    console.error('[YouTube] Request failed:', error);
    return NextResponse.json({ error: 'Unable to get video recommendations.' }, { status: 502 });
  }
}
