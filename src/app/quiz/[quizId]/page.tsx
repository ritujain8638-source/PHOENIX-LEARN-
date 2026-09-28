'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS_DATA, getQuestionsBySubject } from '@/data/questions';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { usePhoenix } from '@/hooks/usePhoenix';
import PhoenixCelebration from '@/components/phoenix/PhoenixCelebration';

export default function ActiveQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;

  const { saveProgress } = useProgress();
  const { checkAndUpdateStreak } = useStreak();
  const { celebrate } = usePhoenix();

  const questions = QUESTIONS_DATA.slice(0, 5); // 5 rapid questions
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isQuizFinished || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuizFinished, timeLeft]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: index }));
    setIsAnswered(true);
  };

  const handleNext = () => {
    setIsAnswered(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsQuizFinished(true);
    checkAndUpdateStreak();

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercent = (correctCount / questions.length) * 100;
    saveProgress('daily-quiz', scorePercent);

    if (scorePercent >= 80) {
      setShowCelebration(true);
      celebrate('quiz');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct++;
    });
    const percent = Math.round((correct / questions.length) * 100);
    const xp = correct * 30 + 50;
    return { correct, total: questions.length, percent, xp };
  };

  return (
    <div className="min-h-screen bg-void text-white flex flex-col justify-between">
      {/* Quiz Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/quiz"
            className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
          >
            ✕ Exit
          </Link>
          <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            {quizId === 'daily' ? 'Daily Assessment' : 'Rapid Mastery Challenge'}
          </span>
        </div>

        {/* Real-time Clock */}
        <div
          className={`font-mono font-bold text-sm px-4 py-1.5 rounded-full border ${
            timeLeft < 60
              ? 'text-red-400 bg-red-950/40 border-red-500/50 animate-pulse'
              : 'text-amber-400 bg-amber-950/30 border-amber-500/30'
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>

        {/* Progress tracker */}
        <div className="text-xs font-mono text-zinc-400">
          Q {currentIndex + 1} / {questions.length}
        </div>
      </header>

      {/* Main Question Body or Results */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        {!isQuizFinished ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Question Header & Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-3 py-1 rounded-full uppercase bg-orange-950/50 text-orange-400 border border-orange-500/20">
                  {currentQ.difficulty.toUpperCase()} • {currentQ.source}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  +30 XP
                </span>
              </div>

              {/* Question Text */}
              <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/90 border border-white/10 shadow-2xl backdrop-blur-xl">
                <p className="text-base md:text-lg font-medium text-white leading-relaxed">
                  {currentQ.text}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;
                  const isCorrect = idx === currentQ.correctAnswer;

                  let borderClass = 'border-white/10 hover:border-orange-500/50 bg-zinc-900/50';
                  if (isAnswered) {
                    if (isCorrect) {
                      borderClass = 'border-green-500 bg-green-950/40 text-green-200 shadow-[0_0_20px_rgba(48,209,88,0.2)]';
                    } else if (isSelected) {
                      borderClass = 'border-red-500 bg-red-950/40 text-red-200 shadow-[0_0_20px_rgba(255,45,85,0.2)]';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-orange-500 bg-orange-950/40 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between text-sm md:text-base font-medium transition-all ${borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono font-bold text-zinc-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isAnswered && isCorrect && <span className="text-green-400 font-bold">✓</span>}
                      {isAnswered && isSelected && !isCorrect && <span className="text-red-400 font-bold">✕</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl bg-orange-950/20 border border-orange-500/30 text-xs md:text-sm text-zinc-300 leading-relaxed space-y-2"
                >
                  <div className="font-bold text-orange-400 flex items-center gap-2">
                    <span>💡</span> Deep Conceptual Explanation:
                  </div>
                  <p>{currentQ.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Results Screen */
          (() => {
            const res = calculateResults();
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-zinc-950/90 border border-white/10 text-center space-y-6 shadow-2xl backdrop-blur-2xl"
              >
                <div className="text-5xl">
                  {res.percent >= 80 ? '🔥' : res.percent >= 50 ? '⚡' : '🌱'}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    {res.percent >= 80 ? 'Phenomenal Mastery!' : 'Knowledge Gap Identified'}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    {res.percent >= 80
                      ? 'You are soaring through the curriculum with sharp accuracy!'
                      : 'Phoenix has targeted the areas where conceptual clarity can be reinforced.'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-white">{res.correct}/{res.total}</div>
                    <div className="text-[10px] font-mono uppercase text-zinc-400 mt-1">Accuracy</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-orange-400">+{res.xp}</div>
                    <div className="text-[10px] font-mono uppercase text-zinc-400 mt-1">XP Gained</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-amber-300">{res.percent}%</div>
                    <div className="text-[10px] font-mono uppercase text-zinc-400 mt-1">Score</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-[0_0_25px_rgba(255,107,53,0.5)]"
                  >
                    Return to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setSelectedAnswers({});
                      setIsAnswered(false);
                      setIsQuizFinished(false);
                      setTimeLeft(300);
                    }}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors"
                  >
                    Retake Challenge
                  </button>
                </div>
              </motion.div>
            );
          })()
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      {!isQuizFinished && (
        <footer className="sticky bottom-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 p-4 flex justify-between items-center max-w-3xl w-full mx-auto">
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === currentIndex
                    ? 'bg-orange-500 ring-2 ring-orange-500/40'
                    : selectedAnswers[i] !== undefined
                    ? 'bg-green-500/80'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,107,53,0.4)]"
            >
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Final Score 🏆'}
            </button>
          )}
        </footer>
      )}

      {/* Celebration */}
      {showCelebration && (
        <PhoenixCelebration
          type="perfect-score"
          message="Sensational! 80%+ Accuracy on the Quiz!"
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
}
