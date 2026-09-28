// ─────────────────────────────────────────────
//  PhoenixLearn – Gemini AI Client
// ─────────────────────────────────────────────

import { GoogleGenAI } from '@google/genai';

// ── Client Initialisation ─────────────────────

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? '';
const client = new GoogleGenAI({ apiKey });

const MODEL = 'gemini-3.8-flash';

// ── Types ─────────────────────────────────────

export interface GeneratedQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'jee';
  tags: string[];
  type: 'mcq' | 'numerical' | 'assertion-reason';
}

export interface FlashCardGenerated {
  front: string;
  back: string;
}

export interface KnowledgeGapAnalysis {
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  estimatedMasteryPercent: number;
  nextTopics: string[];
  studyPlan: string;
}

export interface PersonalisedPath {
  recommendedTopics: string[];
  dailyPlan: string;
  focusAreas: string[];
  estimatedCompletionDays: number;
  motivationalMessage: string;
}

export interface YouTubeRecommendation {
  searchQuery: string;
  topics: string[];
  channelSuggestions: string[];
  keywordsToSearch: string[];
  estimatedVideoDuration: string;
}

// ── System Prompts ────────────────────────────

const COPILOT_BASE_PROMPT = `You are PhoenixBot, an expert AI study copilot for Indian high school and JEE/NEET students (classes 9–12).

Your capabilities:
- Solve doubts in Mathematics, Physics, Chemistry, Biology, Computer Science, and English
- Explain concepts clearly with step-by-step solutions
- Use relevant Indian exam context (NCERT, JEE, NEET, CBSE, ICSE)
- Provide multiple approaches to problems when helpful
- Use LaTeX notation for mathematical expressions (wrap in $..$ or $$..$$)
- Be encouraging, patient, and motivating
- Reference chapter names from NCERT/RD Sharma/HC Verma when applicable

Response format:
- Start with a brief, clear explanation
- Provide step-by-step solution if it's a problem
- End with a key insight or tip
- Keep responses concise but complete

Remember: You are not just answering questions; you are building the student's understanding.`;

// ── Core API Helper ───────────────────────────

async function geminiChat(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction ?? COPILOT_BASE_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const text = response.text ?? '';
    return text;
  } catch (error) {
    console.error('[Gemini] generateContent error:', error);
    throw new Error('Failed to get response from Gemini AI. Please try again.');
  }
}

// ── Copilot Chat ──────────────────────────────

/**
 * Creates a contextual copilot chat session for doubt solving.
 * Returns an async function that sends a message and returns the AI response.
 *
 * @param systemPrompt - Custom system context (e.g., which subject/topic)
 */
export function createCopilotChat(systemPrompt?: string) {
  const history: { role: string; content: string }[] = [];
  const systemInstruction = systemPrompt
    ? `${COPILOT_BASE_PROMPT}\n\nAdditional Context:\n${systemPrompt}`
    : COPILOT_BASE_PROMPT;

  return {
    /**
     * Sends a user message and returns the AI response string.
     */
    async sendMessage(userMessage: string): Promise<string> {
      history.push({ role: 'user', content: userMessage });

      // Build context-aware prompt with history
      const contextualPrompt =
        history.length > 1
          ? history
              .slice(-6) // Keep last 3 exchanges for context
              .map((m) => `${m.role === 'user' ? 'Student' : 'PhoenixBot'}: ${m.content}`)
              .join('\n\n') +
            `\n\nStudent: ${userMessage}`
          : userMessage;

      const response = await geminiChat(contextualPrompt, systemInstruction);
      history.push({ role: 'assistant', content: response });
      return response;
    },

    /**
     * Returns the full conversation history.
     */
    getHistory() {
      return [...history];
    },

    /**
     * Clears the conversation history.
     */
    clearHistory() {
      history.length = 0;
    },
  };
}

// ── Question Generation ───────────────────────

/**
 * Generates multiple-choice questions for a given topic.
 *
 * @param topic - The topic name (e.g., "Integration by Parts")
 * @param difficulty - Desired difficulty level
 * @param count - Number of questions to generate
 * @param subject - Subject context for better generation
 */
export async function generateQuestions(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'jee',
  count: number,
  subject?: string
): Promise<GeneratedQuestion[]> {
  const systemPrompt = `You are an expert question creator for Indian competitive exams (JEE, NEET, CBSE).
Generate exactly ${count} high-quality ${difficulty}-level MCQ questions about "${topic}"${subject ? ` in ${subject}` : ''}.

IMPORTANT: Respond with ONLY valid JSON array. No markdown, no explanation, just the JSON.

Format each question as:
{
  "text": "question text (use LaTeX for math: $expression$)",
  "options": ["option A", "option B", "option C", "option D"],
  "correctAnswer": 0,
  "explanation": "detailed step-by-step explanation",
  "difficulty": "${difficulty}",
  "tags": ["tag1", "tag2"],
  "type": "mcq"
}`;

  const prompt = `Generate ${count} ${difficulty}-difficulty MCQ questions on the topic: "${topic}"${
    subject ? ` (Subject: ${subject})` : ''
  }. Return only a JSON array.`;

  try {
    const response = await geminiChat(prompt, systemPrompt);

    // Strip markdown code fences if present
    const cleaned = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned) as GeneratedQuestion[];
    return Array.isArray(parsed) ? parsed.slice(0, count) : [];
  } catch (error) {
    console.error('[Gemini] generateQuestions parse error:', error);
    return [];
  }
}

// ── Knowledge Gap Analysis ────────────────────

/**
 * Analyses a set of quiz responses to identify knowledge gaps.
 *
 * @param responses - Array of { questionText, selectedAnswer, correctAnswer, isCorrect, topic }
 */
export async function analyzeKnowledgeGap(
  responses: {
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    topic: string;
    difficulty: string;
  }[]
): Promise<KnowledgeGapAnalysis> {
  const systemPrompt = `You are an expert educational analyst specialising in Indian high school and competitive exam preparation.
Analyse the student's quiz performance and provide actionable insights.
Respond with ONLY valid JSON. No markdown.`;

  const wrongResponses = responses.filter((r) => !r.isCorrect);
  const correctResponses = responses.filter((r) => r.isCorrect);

  const prompt = `Analyse this student's quiz performance:

Total Questions: ${responses.length}
Correct: ${correctResponses.length}
Wrong: ${wrongResponses.length}
Accuracy: ${Math.round((correctResponses.length / responses.length) * 100)}%

Wrong answers:
${wrongResponses
  .map(
    (r, i) =>
      `${i + 1}. Topic: ${r.topic} | Q: ${r.questionText.slice(0, 80)}... | Selected: ${r.selectedAnswer} | Correct: ${r.correctAnswer}`
  )
  .join('\n')}

Correct topics: ${[...new Set(correctResponses.map((r) => r.topic))].join(', ')}

Return JSON with this exact structure:
{
  "weakAreas": ["topic1", "topic2"],
  "strongAreas": ["topic3", "topic4"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "estimatedMasteryPercent": 65,
  "nextTopics": ["nextTopic1", "nextTopic2"],
  "studyPlan": "Brief 2-3 sentence personalised study plan"
}`;

  try {
    const response = await geminiChat(prompt, systemPrompt);
    const cleaned = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleaned) as KnowledgeGapAnalysis;
  } catch (error) {
    console.error('[Gemini] analyzeKnowledgeGap parse error:', error);
    return {
      weakAreas: [],
      strongAreas: [],
      recommendations: ['Review the topics you got wrong', 'Practice more questions', 'Re-read the theory'],
      estimatedMasteryPercent: Math.round((responses.filter((r) => r.isCorrect).length / responses.length) * 100),
      nextTopics: [],
      studyPlan: 'Focus on the topics you got wrong and practice regularly.',
    };
  }
}

// ── YouTube Recommendations ───────────────────

/**
 * Suggests YouTube search queries and keywords for a given topic.
 *
 * @param topic - Topic name (e.g., "Integration by Parts")
 * @param chapter - Chapter name for context
 * @param subject - Subject name
 */
export async function recommendYouTubeTopics(
  topic: string,
  chapter: string,
  subject: string
): Promise<YouTubeRecommendation> {
  const systemPrompt = `You are an expert at finding the best YouTube educational content for Indian students.
You know popular Indian educators: Vedantu, Physics Wallah, Unacademy, Khan Academy India, Arvind Academy, etc.
Respond with ONLY valid JSON. No markdown.`;

  const prompt = `Suggest the best YouTube search queries and channels for learning:
Topic: "${topic}"
Chapter: "${chapter}"  
Subject: "${subject}"
Context: Indian students preparing for CBSE/JEE/NEET (classes 9-12)

Return JSON:
{
  "searchQuery": "best exact search query to find this topic on YouTube",
  "topics": ["related sub-topic 1", "related sub-topic 2", "related sub-topic 3"],
  "channelSuggestions": ["Channel Name 1", "Channel Name 2", "Channel Name 3"],
  "keywordsToSearch": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "estimatedVideoDuration": "15-20 minutes"
}`;

  try {
    const response = await geminiChat(prompt, systemPrompt);
    const cleaned = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleaned) as YouTubeRecommendation;
  } catch (error) {
    console.error('[Gemini] recommendYouTubeTopics parse error:', error);
    return {
      searchQuery: `${topic} ${subject} explained`,
      topics: [topic],
      channelSuggestions: ['Physics Wallah', 'Vedantu', 'Khan Academy India'],
      keywordsToSearch: [topic, chapter, subject, 'NCERT', 'class 12'],
      estimatedVideoDuration: '15-25 minutes',
    };
  }
}

// ── Image Analysis ────────────────────────────

/**
 * Analyses an image (question paper, diagram, formula) and answers a question about it.
 *
 * @param imageBase64 - Base64-encoded image string (without data: prefix)
 * @param question - The student's question about the image
 */
export async function analyzeImage(
  imageBase64: string,
  question: string
): Promise<string> {
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: `${COPILOT_BASE_PROMPT}\n\nThe student has shared an image and asks:\n${question}\n\nPlease analyse the image carefully and provide a detailed, helpful response.`,
            },
          ],
        },
      ],
    });

    return response.text ?? 'Could not analyse the image. Please try again.';
  } catch (error) {
    console.error('[Gemini] analyzeImage error:', error);
    throw new Error('Failed to analyse image. Please check the image and try again.');
  }
}

// ── Flash Card Generation ─────────────────────

/**
 * Generates flashcards for spaced repetition learning.
 *
 * @param topic - Topic name
 * @param count - Number of flashcards to generate
 * @param subject - Subject context
 */
export async function generateFlashCards(
  topic: string,
  count: number,
  subject?: string
): Promise<FlashCardGenerated[]> {
  const systemPrompt = `You are an expert at creating concise, effective flashcards for Indian high school students.
Create flashcards that test key concepts, formulas, and definitions.
Respond with ONLY valid JSON array. No markdown.`;

  const prompt = `Create ${count} flashcards for the topic "${topic}"${
    subject ? ` in ${subject}` : ''
  }.

Each card should test one specific concept, formula, or fact. Make the front (question) clear and the back (answer) concise but complete.

Return JSON array:
[
  {
    "front": "Question or term (use LaTeX for math: $formula$)",
    "back": "Concise answer or definition"
  }
]`;

  try {
    const response = await geminiChat(prompt, systemPrompt);
    const cleaned = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned) as FlashCardGenerated[];
    return Array.isArray(parsed) ? parsed.slice(0, count) : [];
  } catch (error) {
    console.error('[Gemini] generateFlashCards parse error:', error);
    return [];
  }
}

// ── Personalised Learning Path ─────────────────

/**
 * Generates a personalised study path based on the user's progress data.
 *
 * @param userProgress - Object containing user performance metrics
 */
export async function getPersonalizedPath(userProgress: {
  userId: string;
  totalXP: number;
  level: number;
  streak: number;
  weakTopics: string[];
  strongTopics: string[];
  recentScores: number[];
  targetExam?: string;
  availableHoursPerDay: number;
  subjects: string[];
}): Promise<PersonalisedPath> {
  const systemPrompt = `You are a personalised learning coach for Indian students preparing for competitive exams.
Create a targeted, motivating study path based on their performance data.
Respond with ONLY valid JSON. No markdown.`;

  const avgScore =
    userProgress.recentScores.length > 0
      ? Math.round(
          userProgress.recentScores.reduce((a, b) => a + b, 0) /
            userProgress.recentScores.length
        )
      : 0;

  const prompt = `Create a personalised learning path for this student:

Level: ${userProgress.level} | XP: ${userProgress.totalXP} | Streak: ${userProgress.streak} days
Average Score: ${avgScore}%
Subjects: ${userProgress.subjects.join(', ')}
${userProgress.targetExam ? `Target Exam: ${userProgress.targetExam}` : ''}
Available: ${userProgress.availableHoursPerDay} hours/day

Weak Topics (needs focus): ${userProgress.weakTopics.slice(0, 5).join(', ') || 'None identified yet'}
Strong Topics (can revise quickly): ${userProgress.strongTopics.slice(0, 5).join(', ') || 'None identified yet'}

Return JSON:
{
  "recommendedTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "dailyPlan": "Specific daily study plan (2-3 sentences)",
  "focusAreas": ["area1", "area2", "area3"],
  "estimatedCompletionDays": 45,
  "motivationalMessage": "Personalised motivational message for this student (1-2 sentences)"
}`;

  try {
    const response = await geminiChat(prompt, systemPrompt);
    const cleaned = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleaned) as PersonalisedPath;
  } catch (error) {
    console.error('[Gemini] getPersonalizedPath parse error:', error);
    return {
      recommendedTopics: userProgress.weakTopics.slice(0, 5),
      dailyPlan: `Study ${userProgress.availableHoursPerDay} hours per day focusing on your weak areas first.`,
      focusAreas: userProgress.weakTopics.slice(0, 3),
      estimatedCompletionDays: 60,
      motivationalMessage: 'Keep going! Every day of practice brings you closer to your goal. 🔥',
    };
  }
}

// ── Topic Summary ─────────────────────────────

/**
 * Generates a comprehensive topic summary for quick revision.
 *
 * @param topic - Topic name
 * @param subject - Subject name
 * @param level - Class/level (e.g., '11', '12', 'JEE')
 */
export async function generateTopicSummary(
  topic: string,
  subject: string,
  level: string
): Promise<string> {
  const systemPrompt = `You are an expert educator creating concise but comprehensive topic summaries for Indian students.
Format using markdown. Include key formulas in LaTeX ($$...$$), use bullet points, and highlight important points.`;

  const prompt = `Create a comprehensive revision summary for:
Topic: "${topic}"
Subject: ${subject}
Level: Class ${level} / ${level === '12' || level === 'JEE' ? 'JEE' : 'CBSE'}

Include:
1. Core concept explanation (2-3 sentences)
2. Key formulas/theorems (LaTeX format)
3. Important points to remember (bullets)
4. Common mistakes to avoid
5. Exam tips

Keep it concise and exam-focused.`;

  return geminiChat(prompt, systemPrompt);
}

// ── Hint Generator ────────────────────────────

/**
 * Generates a progressive hint for a question without giving away the full answer.
 *
 * @param questionText - The full question text
 * @param hintLevel - 1 (subtle nudge) to 3 (near-complete hint)
 */
export async function generateHint(
  questionText: string,
  hintLevel: 1 | 2 | 3
): Promise<string> {
  const systemPrompt = `You are a helpful tutor who provides hints without giving away the complete answer.
Hints should build understanding, not just reveal the answer.`;

  const hintDescriptions = {
    1: 'a very subtle nudge pointing to the right concept or formula to use',
    2: 'a clearer hint showing the approach/method without the full solution',
    3: 'a detailed hint with the key step highlighted, but not the final answer',
  };

  const prompt = `Provide ${hintDescriptions[hintLevel]} for this question:

"${questionText}"

Hint Level ${hintLevel}/3: Give ${hintDescriptions[hintLevel]}.
Keep it to 2-3 sentences maximum.`;

  return geminiChat(prompt, systemPrompt);
}

// ── Export client for direct use ──────────────
export { client as geminiClient, MODEL as GEMINI_MODEL };
