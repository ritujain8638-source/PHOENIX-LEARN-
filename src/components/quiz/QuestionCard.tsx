'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'JEE'

export interface AnswerOption {
  id: 'A' | 'B' | 'C' | 'D'
  text: string
  latex?: boolean // render option as LaTeX
}

export interface Question {
  id: string
  text: string
  latex?: boolean // render question as LaTeX block
  imageUrl?: string
  options: AnswerOption[]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation?: string
  explanationLatex?: boolean
  difficulty: Difficulty
  subject?: string
  chapter?: string
}

export interface QuestionCardProps {
  question: Question
  onAnswer: (optionId: 'A' | 'B' | 'C' | 'D') => void
  answered: boolean
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null
  showExplanation?: boolean
  questionNumber?: number
  totalQuestions?: number
}

// ---------------------------------------------------------------------------
// Difficulty badge colours
// ---------------------------------------------------------------------------
const difficultyConfig: Record<Difficulty, { label: string; bg: string; text: string; border: string }> = {
  Easy:   { label: 'Easy',   bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  Medium: { label: 'Medium', bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  border: 'border-yellow-500/40'  },
  Hard:   { label: 'Hard',   bg: 'bg-orange-500/20',  text: 'text-orange-400',  border: 'border-orange-500/40'  },
  JEE:    { label: 'JEE',    bg: 'bg-red-500/20',     text: 'text-red-400',     border: 'border-red-500/40'     },
}

// ---------------------------------------------------------------------------
// Helper: parse text that may contain \( inline \) or \[ block \] LaTeX
// We split by those delimiters and render accordingly.
// ---------------------------------------------------------------------------
function RichText({ text, block = false }: { text: string; block?: boolean }) {
  // Patterns: \[...\] for block, \(...\) for inline
  const parts = text.split(/(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          return <BlockMath key={i} math={part.slice(2, -2).trim()} />
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          return <InlineMath key={i} math={part.slice(2, -2).trim()} />
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
// Option button
// ---------------------------------------------------------------------------
interface OptionProps {
  option: AnswerOption
  selected: boolean
  answered: boolean
  isCorrect: boolean
  isWrong: boolean
  onClick: () => void
}

function OptionButton({ option, selected, answered, isCorrect, isWrong, onClick }: OptionProps) {
  let baseClasses =
    'relative w-full text-left rounded-xl border-2 px-5 py-4 transition-all duration-300 cursor-pointer group'

  let stateClasses = 'border-white/10 bg-white/5 hover:border-orange-400/60 hover:bg-orange-400/5'

  if (selected && !answered) {
    stateClasses = 'border-orange-400 bg-orange-400/15 shadow-[0_0_20px_rgba(251,146,60,0.25)]'
  } else if (isCorrect && answered) {
    stateClasses = 'border-emerald-400 bg-emerald-400/15 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
  } else if (isWrong && answered) {
    stateClasses = 'border-red-400 bg-red-400/15 shadow-[0_0_20px_rgba(248,113,113,0.3)]'
  } else if (answered) {
    stateClasses = 'border-white/5 bg-white/3 opacity-60 cursor-default'
  }

  return (
    <motion.button
      whileHover={!answered ? { scale: 1.015 } : {}}
      whileTap={!answered ? { scale: 0.99 } : {}}
      onClick={!answered ? onClick : undefined}
      className={`${baseClasses} ${stateClasses}`}
    >
      <div className="flex items-center gap-4">
        {/* Letter badge */}
        <span
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border
            ${selected && !answered ? 'bg-orange-400 border-orange-400 text-gray-900' : ''}
            ${isCorrect && answered ? 'bg-emerald-400 border-emerald-400 text-gray-900' : ''}
            ${isWrong && answered ? 'bg-red-400 border-red-400 text-gray-900' : ''}
            ${!selected && !(isCorrect && answered) && !(isWrong && answered) ? 'bg-white/10 border-white/20 text-gray-300' : ''}
          `}
        >
          {option.id}
        </span>

        {/* Option text */}
        <span className={`flex-1 text-base leading-relaxed ${
          answered && !isCorrect && !isWrong ? 'text-gray-500' : 'text-gray-100'
        }`}>
          {option.latex ? <InlineMath math={option.text} /> : <RichText text={option.text} />}
        </span>

        {/* State icon */}
        {isCorrect && answered && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
        {isWrong && answered && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
      </div>
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Main QuestionCard
// ---------------------------------------------------------------------------
export default function QuestionCard({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showExplanation = true,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [explanationOpen, setExplanationOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reported, setReported] = useState(false)

  const diff = difficultyConfig[question.difficulty]
  const isCorrect = answered && selectedAnswer === question.correctAnswer

  function handleReport() {
    setReported(true)
    setTimeout(() => setReportOpen(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {questionNumber !== undefined && totalQuestions !== undefined && (
            <span className="text-sm text-gray-400 font-medium">
              Question {questionNumber} of {totalQuestions}
            </span>
          )}
          {question.subject && (
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-gray-300 font-medium">
              {question.subject}
            </span>
          )}
          {question.chapter && (
            <span className="hidden sm:inline px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              {question.chapter}
            </span>
          )}
        </div>
        {/* Difficulty badge */}
        <span
          className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${diff.bg} ${diff.text} ${diff.border}`}
        >
          {diff.label}
        </span>
      </div>

      {/* ── Question text ── */}
      <div className="rounded-2xl bg-white/5 border border-white/10 px-6 py-5">
        <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-medium">
          {question.latex ? (
            <BlockMath math={question.text} />
          ) : (
            <RichText text={question.text} />
          )}
        </p>

        {/* Optional image */}
        {question.imageUrl && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.imageUrl}
              alt="Question diagram"
              className="w-full max-h-72 object-contain bg-white/5"
            />
          </div>
        )}
      </div>

      {/* ── Answer options ── */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt.id
          const isCorrectOpt = opt.id === question.correctAnswer
          const isWrongOpt = isSelected && !isCorrectOpt

          return (
            <OptionButton
              key={opt.id}
              option={opt}
              selected={isSelected}
              answered={answered}
              isCorrect={isCorrectOpt && answered}
              isWrong={isWrongOpt}
              onClick={() => onAnswer(opt.id)}
            />
          )
        })}
      </div>

      {/* ── Explanation (shown after answering) ── */}
      {showExplanation && answered && question.explanation && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className={`rounded-2xl border px-6 py-4 ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            {/* Toggle header */}
            <button
              onClick={() => setExplanationOpen((p) => !p)}
              className="flex items-center gap-2 w-full text-left"
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <span className={`font-semibold text-sm ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct! ' : `Incorrect. Correct answer: ${question.correctAnswer}. `}
                <span className="text-gray-300 font-normal">View explanation</span>
              </span>
              <span className="ml-auto text-gray-400">
                {explanationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            <AnimatePresence>
              {explanationOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 text-gray-200 text-sm leading-relaxed border-t border-white/10 mt-3">
                    {question.explanationLatex ? (
                      <BlockMath math={question.explanation} />
                    ) : (
                      <RichText text={question.explanation} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Report Issue ── */}
      <div className="flex justify-end">
        <div className="relative">
          <button
            onClick={() => setReportOpen((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-400 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            Report Issue
          </button>

          <AnimatePresence>
            {reportOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 6 }}
                className="absolute right-0 bottom-full mb-2 w-64 rounded-xl bg-gray-800 border border-white/15 shadow-2xl p-4 z-50"
              >
                {reported ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Thanks! We'll review this question.
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-300 font-medium mb-3">Report an issue with this question</p>
                    {['Wrong answer', 'Unclear question', 'Incorrect options', 'Other'].map((reason) => (
                      <button
                        key={reason}
                        onClick={handleReport}
                        className="block w-full text-left text-xs text-gray-400 hover:text-orange-400 py-1.5 transition-colors"
                      >
                        {reason}
                      </button>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
