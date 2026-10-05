import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const MAX_MESSAGE_LENGTH = 8_000;
const MAX_HISTORY_LENGTH = 12;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const context = body.context && typeof body.context === 'object'
      ? body.context as Record<string, unknown>
      : {};
    const historyInput = body.history ?? [];
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }
    if (!Array.isArray(historyInput) || historyInput.length > MAX_HISTORY_LENGTH) {
      return NextResponse.json({ error: `history must contain no more than ${MAX_HISTORY_LENGTH} messages.` }, { status: 400 });
    }

    const history: ChatMessage[] = [];
    for (const item of historyInput) {
      if (!item || typeof item !== 'object') {
        return NextResponse.json({ error: 'Each history entry must have a role and content.' }, { status: 400 });
      }
      const entry = item as Record<string, unknown>;
      if (
        !['user', 'assistant', 'model'].includes(String(entry.role)) ||
        typeof entry.content !== 'string' ||
        entry.content.length > MAX_MESSAGE_LENGTH
      ) {
        return NextResponse.json({ error: 'Conversation history contains an invalid message.' }, { status: 400 });
      }
      history.push({
        role: entry.role === 'user' ? 'user' : 'model',
        content: entry.content,
      });
    }

    const parts: Array<Record<string, unknown>> = [{ text: message }];
    if (typeof body.imageBase64 === 'string' && body.imageBase64) {
      const match = body.imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
      if (!match || !IMAGE_TYPES.has(match[1])) {
        return NextResponse.json({ error: 'Image must be a valid JPEG, PNG, WebP, or GIF data URL.' }, { status: 400 });
      }
      if (Buffer.from(match[2], 'base64').byteLength > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: 'Image must be smaller than 8 MB.' }, { status: 413 });
      }
      parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI Copilot is not configured on this server.' }, { status: 503 });
    }

    const topic = typeof context.topic === 'string' ? context.topic.slice(0, 160) : '';
    const subject = typeof context.subject === 'string' ? context.subject.slice(0, 80) : '';
    const systemPrompt = `You are PhoenixLearn's academic mentor for students in Classes 9-12. Explain concepts clearly and supportively; use LaTeX for mathematics. For JEE-level problems, identify the key idea and show the working. Analyze an attached image only when one is provided. Current context: ${subject || 'General'}${topic ? ` - ${topic}` : ''}.`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    let response: Response;
    try {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [
            ...history.map((entry) => ({ role: entry.role, parts: [{ text: entry.content }] })),
            { role: 'user', parts },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      console.error('[Copilot] Gemini request failed:', response.status);
      return NextResponse.json({ error: 'AI Copilot is temporarily unavailable.' }, { status: 502 });
    }
    const data = await response.json();
    const candidate = data?.candidates?.[0];
    if (candidate?.finishReason === 'SAFETY') {
      return NextResponse.json({ error: 'The request could not be answered under content safety guidelines.' }, { status: 422 });
    }
    const reply = candidate?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('').trim();
    if (!reply) {
      return NextResponse.json({ error: 'AI Copilot returned no response.' }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'AI Copilot request timed out. Please try again.' }, { status: 504 });
    }
    console.error('[Copilot] Request failed:', error);
    return NextResponse.json({ error: 'Unable to process this request.' }, { status: 502 });
  }
}
