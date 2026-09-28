'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getTopicById, SUBJECTS } from '@/data/subjects';
import { getQuestionsByTopic, QUESTIONS_DATA } from '@/data/questions';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { usePhoenix } from '@/hooks/usePhoenix';
import PhoenixCelebration from '@/components/phoenix/PhoenixCelebration';
import QuestionCard from '@/components/quiz/QuestionCard';
import FlashCard from '@/components/notes/FlashCard';

export default function TopicLearnPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;

  const topicData = getTopicById(topicId);
  const { saveProgress } = useProgress();
  const { checkAndUpdateStreak } = useStreak();
  const { celebrate, sendMessage } = usePhoenix();

  const [activeTab, setActiveTab] = useState<'theory' | 'flashcards' | 'practice' | 'videos'>('theory');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Fallback to quadratic topic if specific id not matched
  const currentTopic = topicData?.topic || {
    id: 'math-t9',
    name: 'Quadratic Equations & Roots',
    theory: `A quadratic equation is a second-order polynomial equation in a single variable $x$:
    
$$ax^2 + bx + c = 0, \\quad \\text{where } a \\neq 0$$

### 1. The Quadratic Formula
The roots of this fundamental equation are derived by completing the square, yielding:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### 2. The Discriminant ($D$)
The quantity under the radical $D = b^2 - 4ac$ governs the nature of the roots:
- **$D > 0$**: Two distinct real roots.
- **$D = 0$**: Exactly one real root (a repeated/coincident root $x = -b/2a$).
- **$D < 0$**: Two complex conjugate roots $\\frac{-b \\pm i\\sqrt{4ac - b^2}}{2a}$.

### 3. Relations Between Roots and Coefficients (Vieta's Formulas)
If $\\alpha$ and $\\beta$ are roots of $ax^2 + bx + c = 0$:
- **Sum of roots**: $\\alpha + \\beta = -\\frac{b}{a}$
- **Product of roots**: $\\alpha \\cdot \\beta = \\frac{c}{a}$
- **Difference of roots**: $|\\alpha - \\beta| = \\frac{\\sqrt{D}}{|a|}$`,
    keyFormulas: [
      { id: 'f1', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', description: 'Quadratic Root Formula' },
      { id: 'f2', latex: 'D = b^2 - 4ac', description: 'Discriminant' },
      { id: 'f3', latex: '\\alpha + \\beta = -b/a, \\quad \\alpha\\beta = c/a', description: 'Vieta\'s Formulas' }
    ]
  };

  const subject = topicData?.subject || SUBJECTS[0];
  const questions = getQuestionsByTopic(topicId).length > 0
    ? getQuestionsByTopic(topicId)
    : QUESTIONS_DATA.slice(0, 3);

  const flashcards = [
    {
      id: 'fc-1',
      front: 'What does $D < 0$ indicate about the roots of $ax^2 + bx + c = 0$?',
      back: 'The equation has no real roots. It has two complex conjugate roots: $x = \\frac{-b \\pm i\\sqrt{|D|}}{2a}$.'
    },
    {
      id: 'fc-2',
      front: 'What is the sum and product of roots in terms of coefficients?',
      back: 'Sum $\\alpha + \\beta = -b/a$. Product $\\alpha\\beta = c/a$. Derived directly from Vieta\'s theorem.'
    },
    {
      id: 'fc-3',
      front: 'Under what condition does the quadratic expression $ax^2 + bx + c$ always stay positive for all real $x$?',
      back: '$a > 0$ and $D < 0$. The parabola opens upwards and never touches the $x$-axis.'
    }
  ];

  const youtubeVideos = [
    {
      title: 'Essence of Quadratic Equations & Complex Roots',
      channel: '3Blue1Brown',
      duration: '18 min',
      url: 'https://youtube.com',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      reason: 'Deep intuitive geometric insight into why the discriminant decides the roots.'
    },
    {
      title: 'RD Sharma Class 11 - Quadratic Equations Complete One Shot',
      channel: 'Physics Wallah',
      duration: '45 min',
      url: 'https://youtube.com',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      reason: 'Comprehensive theory with 20+ solved textbook problems and PYQs.'
    }
  ];

  const handleCopyFormula = (latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedFormula(latex);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const q = questions[currentQuestionIndex];
    if (optionIndex === q.correctAnswer) {
      setEarnedXP((prev) => prev + 25);
      saveProgress(currentTopic.id, 100);
      checkAndUpdateStreak();
      if (currentQuestionIndex === questions.length - 1) {
        setShowCelebration(true);
        celebrate('topic');
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-void text-white pb-24">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-void/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: subject.color }}
              />
              <span className="text-xs uppercase font-mono text-zinc-400 tracking-wider">
                {subject.name}
              </span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-white line-clamp-1">
              {currentTopic.name}
            </h1>
          </div>
        </div>

        {/* Tab Controls (Brilliant / Duolingo Style) */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {(['theory', 'flashcards', 'practice', 'videos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(255,107,53,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Learning Canvas */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* TAB 1: INTERACTIVE THEORY */}
          {activeTab === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Theory Content Box */}
              <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      Foundational Concept & Derivation
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-orange-400 bg-orange-950/40 px-3 py-1 rounded-full border border-orange-500/20">
                    RD Sharma Standard
                  </span>
                </div>

                <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-4">
                  <p>
                    A quadratic equation is a polynomial equation of degree 2. Its graph forms a smooth parabola, and determining where this parabola intersects the horizontal axis provides the real roots of the equation.
                  </p>

                  <div className="my-6 p-5 rounded-xl bg-orange-950/20 border border-orange-500/30 text-center font-mono text-lg text-amber-200">
                    {'ax² + bx + c = 0, where a ≠ 0'}
                  </div>

                  <h3 className="text-lg font-bold text-white mt-6">
                    Key Deductions from the Discriminant ($D$)
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                    <li><strong className="text-green-400">D &gt; 0:</strong> Parabola crosses the axis twice (two real distinct roots).</li>
                    <li><strong className="text-amber-400">D = 0:</strong> Parabola touches the axis at its vertex (one coincident root).</li>
                    <li><strong className="text-red-400">D &lt; 0:</strong> Parabola never touches the axis (two imaginary conjugate roots).</li>
                  </ul>
                </div>
              </div>

              {/* Essential Formulas Strip */}
              <div className="space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <span>⚡</span> High-Yield Formula Vault
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentTopic.keyFormulas?.map((formula: any) => (
                    <div
                      key={formula.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="text-xs text-zinc-400 mb-2 font-mono">
                        {formula.description}
                      </div>
                      <div className="text-sm md:text-base font-mono text-amber-300 py-2">
                        {formula.latex}
                      </div>
                      <button
                        onClick={() => handleCopyFormula(formula.latex)}
                        className="mt-3 text-xs text-zinc-400 hover:text-white flex items-center justify-end gap-1"
                      >
                        {copiedFormula === formula.latex ? '✓ Copied' : '📋 Copy LaTeX'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready to Practice CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-zinc-900/80 to-zinc-950 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Concept Understood?</h4>
                    <p className="text-xs text-zinc-400">Test your mastery with 3 rapid questions right now.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('practice')}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,107,53,0.4)]"
                >
                  Start Practice →
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: 3D FLIP FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">Concept Memory Deck</h2>
                <p className="text-xs text-zinc-400">Click any card to flip and verify your recall.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                  <FlashCard
                    key={card.id}
                    front={card.front}
                    back={card.back}
                    mastered={false}
                    onMastered={() => {}}
                    onSkip={() => {}}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: ADAPTIVE PRACTICE (DUOLINGO / BRILLIANT HYBRID) */}
          {activeTab === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                <span>QUESTION {currentQuestionIndex + 1} OF {questions.length}</span>
                <span className="text-orange-400 font-bold">+{earnedXP} XP EARNED</span>
              </div>

              {questions[currentQuestionIndex] && (
                <QuestionCard
                  question={questions[currentQuestionIndex]}
                  answered={selectedAnswer !== null}
                  selectedAnswer={selectedAnswer}
                  showExplanation={selectedAnswer !== null}
                  onAnswer={handleAnswerSubmit}
                />
              )}

              {selectedAnswer !== null && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,107,53,0.4)]"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Complete Topic 🔥'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: AI RECOMMENDED VIDEOS */}
          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📺</span> AI-Curated Concept Clarification
                </h2>
                <p className="text-xs text-zinc-400">
                  Targeted YouTube lectures mapped to fill knowledge gaps in {currentTopic.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {youtubeVideos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden hover:border-orange-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-zinc-900">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {vid.duration}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-mono text-orange-400">{vid.channel}</div>
                        <h4 className="text-sm font-bold text-white mt-1 line-clamp-2">{vid.title}</h4>
                        <p className="text-xs text-zinc-400 mt-2 italic">{vid.reason}</p>
                      </div>
                      <a
                        href={vid.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors"
                      >
                        Watch on YouTube ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Celebration Popup on Topic Completion */}
      {showCelebration && (
        <PhoenixCelebration
          type="level-up"
          message={`Mastery Unlocked! You earned ${earnedXP} XP on ${currentTopic.name}!`}
          onComplete={() => {
            setShowCelebration(false);
            router.push('/dashboard');
          }}
        />
      )}
    </div>
  );
}
