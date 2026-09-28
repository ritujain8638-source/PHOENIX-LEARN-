import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, imageBase64, context } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply:
          "⚠️ Gemini API key is not configured. Please add `GEMINI_API_KEY` or `NEXT_PUBLIC_GEMINI_API_KEY` to your Vercel Environment Variables.",
      });
    }

    // ── Build system prompt ──────────────────────────────────────────────────
    const systemPrompt = `You are PhoenixLearn's AI Copilot - an intelligent, friendly academic assistant. 
You help students (Class 9-12) with doubts in Mathematics, Physics, Chemistry, Biology, and Coding.
Current context: ${context?.subject || 'General'} - ${context?.topic || ''}

Personality: Smart, encouraging, slightly witty. Not childish. Think of a brilliant college senior mentoring juniors.
Format math using LaTeX notation: $inline$ and $$block$$
Keep explanations clear, structured, and include worked examples.
For JEE-level questions, mention the difficulty and approach.
If given an image, analyze it and explain/solve what's shown.
Use markdown for structure (headers, bullet points, bold, code blocks).`;

    // ── Build conversation text with history ─────────────────────────────────
    let conversationText = '';
    if (history && history.length > 0) {
      conversationText = history
        .map((m: { role: string; content: string }) =>
          `${m.role === 'user' ? 'Student' : 'AI Copilot'}: ${m.content}`
        )
        .join('\n');
      conversationText += '\n';
    }
    conversationText += `Student: ${message}`;

    // ── Build Gemini API request ─────────────────────────────────────────────
    // Using the Gemini generateContent endpoint (v1beta, gemini-1.5-flash)
    const geminiModel = 'gemini-1.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    // Build parts array
    const textPart = {
      text: `${systemPrompt}\n\n${conversationText}`,
    };

    let parts: object[];

    if (imageBase64) {
      // Include image in multimodal request
      parts = [
        {
          text: `${systemPrompt}\n\nStudent asks (with an image attached): ${message}`,
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
      ];
    } else {
      parts = [textPart];
    }

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      console.error('Gemini API error:', response.status, errText);

      // Graceful fallback
      return NextResponse.json({
        reply:
          "I'm having trouble connecting to Gemini right now. Please check your API key configuration. In the meantime, try breaking down your problem step by step! 🔥",
      });
    }

    const data = await response.json();

    // Extract the text from Gemini response
    const reply: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.output ??
      'I could not generate a response. Please try again.';

    // Check for safety blocks
    const finishReason = data?.candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY') {
      return NextResponse.json({
        reply:
          "I couldn't respond to that due to content safety guidelines. Try rephrasing your question!",
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Copilot route error:', error);
    return NextResponse.json({
      reply:
        'Something went wrong. Please try again! Remember: every error is a learning opportunity. 🔥',
    });
  }
}
