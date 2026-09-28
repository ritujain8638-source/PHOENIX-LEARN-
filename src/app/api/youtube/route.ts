import { NextRequest, NextResponse } from 'next/server';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoRecommendation {
  title: string;
  channel: string;
  searchQuery: string;
  duration: string;
  description: string;
  thumbnail: string;
  reason: string;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, subject, chapter } = body;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
      return NextResponse.json({ videos: [], error: 'API key not configured' });
    }

    if (!topic || !subject) {
      return NextResponse.json({ videos: [], error: 'topic and subject are required' });
    }

    // ── Build prompt ─────────────────────────────────────────────────────────
    const prompt = `Suggest 3 specific YouTube video recommendations for a Class 11-12 student learning about "${topic}" in ${subject}${chapter ? ` (Chapter: ${chapter})` : ''}.

Return as a JSON array with this exact structure:
[
  {
    "title": "specific video title that would appear on YouTube",
    "channel": "channel name (e.g., 3Blue1Brown, Physics Wallah, Khan Academy, Veritasium, MIT OpenCourseWare, Organic Chemistry Tutor)",
    "searchQuery": "exact YouTube search query string a student would type to find this video",
    "duration": "realistic estimated duration like '18 min' or '45 min'",
    "description": "one concise line describing exactly what concept or problem this video covers",
    "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "reason": "one sentence explaining why this specific video is the best choice for this topic"
  }
]

Important rules:
- Suggest videos from well-known, reputable educational channels only.
- For Indian curriculum topics, prefer Physics Wallah, Vedantu, Unacademy, or similar.
- For conceptual topics, prefer 3Blue1Brown, Veritasium, MinutePhysics, or similar.
- For coding topics, prefer Traversy Media, Fireship, CS Dojo, or similar.
- The searchQuery should be realistic and specific enough to find the video.
- Do NOT invent channel names; use only real, established channels.
- Return ONLY the JSON array, no markdown, no extra text.`;

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
          temperature: 0.5,
          topK: 32,
          topP: 0.9,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Gemini YouTube error:', response.status, errText);
      return NextResponse.json({ videos: [] });
    }

    const data = await response.json();

    // ── Extract text ─────────────────────────────────────────────────────────
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) {
      console.warn('Empty response from Gemini YouTube endpoint');
      return NextResponse.json({ videos: [] });
    }

    // ── Parse JSON ───────────────────────────────────────────────────────────
    try {
      // Strip markdown code fences if present
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const videos: VideoRecommendation[] = JSON.parse(cleaned);

      if (!Array.isArray(videos)) {
        throw new Error('Response is not an array');
      }

      // Sanitize and validate each video entry
      const sanitized: VideoRecommendation[] = videos
        .filter((v) => v && typeof v === 'object')
        .map((v) => ({
          title: v.title ?? 'Educational Video',
          channel: v.channel ?? 'Educational Channel',
          searchQuery: v.searchQuery ?? `${topic} ${subject} tutorial`,
          duration: v.duration ?? '15 min',
          description: v.description ?? `Learn about ${topic}`,
          // Replace any non-YouTube thumbnails with a reliable placeholder
          thumbnail:
            typeof v.thumbnail === 'string' && v.thumbnail.includes('youtube.com')
              ? v.thumbnail
              : `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          reason: v.reason ?? `Great introduction to ${topic}`,
        }))
        .slice(0, 3); // Cap at 3 videos

      return NextResponse.json({ videos: sanitized });
    } catch (parseError) {
      console.error('Failed to parse YouTube JSON:', parseError);
      console.error('Raw text was:', rawText.slice(0, 500));
      return NextResponse.json({ videos: [] });
    }
  } catch (error) {
    console.error('YouTube route error:', error);
    return NextResponse.json({ videos: [] });
  }
}
