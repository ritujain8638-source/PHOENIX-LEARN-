'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Types ──────────────────────────────────────────────────────────────────

interface NotePage {
  title: string
  content: string[]
}

interface NoteData {
  id: string
  title: string
  subject: string
  chapter: string
  type: '2D' | '3D' | 'PDF'
  pdfUrl?: string
  outline: { title: string; page: number }[]
  formulas: { label: string; expr: string }[]
  pages: NotePage[]
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const NOTE_DATA: NoteData = {
  id: '1',
  title: 'Differential Calculus',
  subject: 'Mathematics',
  chapter: 'Chapter 3',
  type: '2D',
  outline: [
    { title: 'Introduction to Limits', page: 1 },
    { title: 'Definition of Derivative', page: 2 },
    { title: 'Differentiation Rules', page: 3 },
    { title: 'Chain Rule', page: 4 },
    { title: 'Implicit Differentiation', page: 5 },
    { title: 'Applications', page: 6 },
  ],
  formulas: [
    { label: 'Derivative (limit def.)', expr: "f'(x) = lim_{h→0} [f(x+h) - f(x)] / h" },
    { label: 'Power Rule', expr: "d/dx [xⁿ] = n·xⁿ⁻¹" },
    { label: 'Product Rule', expr: "(fg)' = f'g + fg'" },
    { label: 'Quotient Rule', expr: "(f/g)' = (f'g - fg') / g²" },
    { label: 'Chain Rule', expr: "d/dx [f(g(x))] = f'(g(x))·g'(x)" },
  ],
  pages: [
    {
      title: 'Introduction to Limits',
      content: [
        '## Limits',
        'The **limit** of a function describes the value a function approaches as the input approaches some value.',
        '',
        '> **Definition:** lim_{x→a} f(x) = L means f(x) can be made arbitrarily close to L by making x sufficiently close to a.',
        '',
        '### One-Sided Limits',
        '- **Left-hand limit:** lim_{x→a⁻} f(x)',
        '- **Right-hand limit:** lim_{x→a⁺} f(x)',
        '',
        '### Key Properties',
        '1. lim [f(x) + g(x)] = lim f(x) + lim g(x)',
        '2. lim [c·f(x)] = c · lim f(x)',
        '3. lim [f(x)·g(x)] = lim f(x) · lim g(x)',
      ],
    },
    {
      title: 'Definition of Derivative',
      content: [
        '## The Derivative',
        'The **derivative** of a function f at a point x is defined as:',
        '',
        "```\nf'(x) = lim_{h→0} [f(x+h) - f(x)] / h\n```",
        '',
        '### Geometric Interpretation',
        "The derivative f'(x) represents the **slope of the tangent line** to the curve y = f(x) at the point (x, f(x)).",
        '',
        '### Notation',
        "- Lagrange: f'(x)",
        '- Leibniz: dy/dx or df/dx',
        '- Newton: ẋ (used in physics)',
        '',
        '> **Key Insight:** A function is differentiable at a point only if it is continuous there, but continuity does not guarantee differentiability.',
      ],
    },
    {
      title: 'Differentiation Rules',
      content: [
        '## Standard Differentiation Rules',
        '',
        '### Power Rule',
        '```\nd/dx [xⁿ] = n·xⁿ⁻¹\n```',
        'Example: d/dx [x³] = 3x²',
        '',
        '### Constant Rule',
        '```\nd/dx [c] = 0\n```',
        '',
        '### Sum / Difference Rule',
        "```\n(f ± g)' = f' ± g'\n```",
        '',
        '### Product Rule',
        "```\n(fg)' = f'g + fg'\n```",
        'Example: d/dx [x²·sin(x)] = 2x·sin(x) + x²·cos(x)',
        '',
        '### Quotient Rule',
        "```\n(f/g)' = (f'g - fg') / g²\n```",
      ],
    },
    {
      title: 'Chain Rule',
      content: [
        '## The Chain Rule',
        '',
        'The **chain rule** is used to differentiate composite functions:',
        '',
        '```\nd/dx [f(g(x))] = f\'(g(x)) · g\'(x)\n```',
        '',
        '### Examples',
        '',
        '**Example 1:** Find d/dx [sin(x²)]',
        '```\nLet f(u) = sin(u),  g(x) = x²\nf\'(u) = cos(u),  g\'(x) = 2x\n⇒ d/dx [sin(x²)] = cos(x²) · 2x\n```',
        '',
        '**Example 2:** Find d/dx [e^(3x)]',
        '```\nLet f(u) = eᵘ,  g(x) = 3x\n⇒ d/dx [e^(3x)] = e^(3x) · 3 = 3e^(3x)\n```',
      ],
    },
    {
      title: 'Implicit Differentiation',
      content: [
        '## Implicit Differentiation',
        '',
        'When y is **implicitly** defined as a function of x, differentiate both sides with respect to x and solve for dy/dx.',
        '',
        '### Example: Circle',
        '```\nx² + y² = r²\n2x + 2y(dy/dx) = 0\ndy/dx = -x/y\n```',
        '',
        '### Example: Ellipse',
        '```\nx²/a² + y²/b² = 1\n2x/a² + (2y/b²)(dy/dx) = 0\ndy/dx = -b²x / (a²y)\n```',
        '',
        '> **Tip:** Always treat y as a function of x when differentiating implicitly. Use the chain rule on any term containing y.',
      ],
    },
    {
      title: 'Applications',
      content: [
        '## Applications of Derivatives',
        '',
        '### 1. Finding Extrema',
        "A **critical point** occurs where f'(x) = 0 or f'(x) is undefined.",
        '- **Local maximum:** f\' changes from + to −',
        '- **Local minimum:** f\' changes from − to +',
        '',
        '### 2. Second Derivative Test',
        "```\nIf f'(c) = 0 and f''(c) > 0 → local min\nIf f'(c) = 0 and f''(c) < 0 → local max\n```",
        '',
        '### 3. Related Rates',
        'Use implicit differentiation with respect to time t to relate rates of change.',
        '',
        '### 4. Linear Approximation',
        "```\nf(x) ≈ f(a) + f'(a)(x - a)  for x near a\n```",
      ],
    },
  ],
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContentBlock({ line, i }: { line: string; i: number }) {
  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>
  if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-violet-300 mt-5 mb-2">{line.slice(4)}</h3>
  if (line.startsWith('```')) return null
  if (line === '') return <div key={i} className="h-2" />
  if (line.startsWith('> ')) {
    const inner = line.slice(2)
    return (
      <div key={i} className="my-3 pl-4 border-l-2 border-yellow-500/60 bg-yellow-500/5 rounded-r-xl py-2 pr-3">
        <p className="text-sm text-yellow-200/90" dangerouslySetInnerHTML={{ __html: inner.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      </div>
    )
  }
  if (line.match(/^\d+\./)) {
    return <li key={i} className="text-sm text-white/80 ml-4 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>
  }
  if (line.startsWith('- ')) {
    const content = line.slice(2)
    return (
      <li key={i} className="text-sm text-white/80 ml-4 list-disc" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
    )
  }
  const html = line
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-violet-300 font-mono text-xs">$1</code>')
  return <p key={i} className="text-sm text-white/75 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
}

// Detect code blocks and render them
function RenderContent({ content }: { content: string[] }) {
  const elements: React.ReactNode[] = []
  let i = 0
  while (i < content.length) {
    if (content[i] === '```') {
      const codeLines: string[] = []
      i++
      while (i < content.length && content[i] !== '```') {
        codeLines.push(content[i])
        i++
      }
      elements.push(
        <pre key={i} className="my-3 p-4 bg-white/5 border border-white/10 rounded-xl overflow-x-auto text-xs text-cyan-300 font-mono leading-relaxed">
          {codeLines.join('\n')}
        </pre>
      )
    } else {
      elements.push(<ContentBlock key={i} line={content[i]} i={i} />)
    }
    i++
  }
  return <>{elements}</>
}

// 3D Book Page
function BookPage({ page, index, totalPages }: { page: NotePage; index: number; totalPages: number }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl border border-white/10 p-8 overflow-y-auto shadow-2xl">
      {/* Page number */}
      <div className="absolute bottom-4 right-6 text-xs text-white/20">
        {index + 1} / {totalPages}
      </div>
      <div className="absolute bottom-4 left-6 w-16 h-px bg-white/10" />
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(139,92,246,0.04)' }} />
      <h3 className="text-base font-bold text-violet-300 mb-5">{page.title}</h3>
      <div className="prose prose-invert max-w-none space-y-1">
        <RenderContent content={page.content} />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NoteViewerPage({ params }: { params: { noteId: string } }) {
  const [mode, setMode] = useState<'2D' | '3D' | 'PDF'>('2D')
  const [currentPage, setCurrentPage] = useState(0)
  const [fontSize, setFontSize] = useState(15)
  const [nightMode, setNightMode] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [flipping, setFlipping] = useState<'left' | 'right' | null>(null)
  const [selectedOutline, setSelectedOutline] = useState<number | null>(null)
  const note = NOTE_DATA

  const goToPage = (dir: 'prev' | 'next') => {
    if (dir === 'prev' && currentPage > 0) {
      setFlipping('right')
      setTimeout(() => { setCurrentPage(p => p - 1); setFlipping(null) }, 350)
    }
    if (dir === 'next' && currentPage < note.pages.length - 1) {
      setFlipping('left')
      setTimeout(() => { setCurrentPage(p => p + 1); setFlipping(null) }, 350)
    }
  }

  const goToOutlinePage = (page: number) => {
    setCurrentPage(page - 1)
    setSelectedOutline(page - 1)
  }

  const bgClass = nightMode ? 'bg-[#070709]' : 'bg-[#0a0a0f]'
  const textBase = { fontSize: `${fontSize}px` }

  return (
    <div className={`min-h-screen ${bgClass} text-white flex flex-col transition-colors duration-300`}>
      {/* Top Bar */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl px-6 py-3 flex items-center gap-4">
        <Link href="/notes" className="text-white/40 hover:text-white text-sm transition">← Notes</Link>
        <div className="h-4 w-px bg-white/10" />
        <div>
          <h1 className="text-sm font-bold text-white">{note.title}</h1>
          <p className="text-xs text-white/30">{note.subject} · {note.chapter}</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-black/20 flex flex-col overflow-y-auto">
          {/* Outline */}
          <div className="p-4 border-b border-white/5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Outline</p>
            <ul className="space-y-1">
              {note.outline.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => goToOutlinePage(item.page)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                      (mode === '3D' ? currentPage === item.page - 1 : selectedOutline === item.page - 1)
                        ? 'bg-violet-500/20 text-violet-300 font-semibold'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-white/20 mr-2">{item.page}.</span>
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Formula Reference */}
          <div className="p-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Quick Formulas</p>
            <div className="space-y-2">
              {note.formulas.map((f, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <p className="text-[10px] text-white/40 mb-1">{f.label}</p>
                  <p className="text-xs text-cyan-300 font-mono">{f.expr}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6" style={textBase}>
            <AnimatePresence mode="wait">
              {mode === '2D' && (
                <motion.div
                  key="2d"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="max-w-3xl mx-auto space-y-6"
                >
                  {note.pages.map((page, pi) => (
                    <div key={pi} className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-1">
                      <h2 className="text-lg font-bold text-violet-300 mb-5">{page.title}</h2>
                      <RenderContent content={page.content} />
                    </div>
                  ))}
                </motion.div>
              )}

              {mode === '3D' && (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[500px]"
                >
                  {/* 3D Book Container */}
                  <div className="relative w-full max-w-2xl" style={{ perspective: '1400px' }}>
                    {/* Shadow stack effect */}
                    <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-black/40 blur-sm" />
                    <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-black/20" />

                    {/* Flipping animation */}
                    <motion.div
                      className="relative"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{
                        rotateY: flipping === 'left' ? -15 : flipping === 'right' ? 15 : 0,
                        scaleX: flipping ? 0.97 : 1,
                      }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      <div className="h-[480px]">
                        <BookPage
                          page={note.pages[currentPage]}
                          index={currentPage}
                          totalPages={note.pages.length}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center gap-6 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                      onClick={() => goToPage('prev')}
                      disabled={currentPage === 0}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center"
                    >
                      ←
                    </motion.button>
                    <div className="flex gap-2">
                      {note.pages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setFlipping(i > currentPage ? 'left' : 'right'); setTimeout(() => { setCurrentPage(i); setFlipping(null) }, 350) }}
                          className={`w-2 h-2 rounded-full transition-all ${i === currentPage ? 'bg-violet-500 w-5' : 'bg-white/20 hover:bg-white/40'}`}
                        />
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                      onClick={() => goToPage('next')}
                      disabled={currentPage === note.pages.length - 1}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center"
                    >
                      →
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {mode === 'PDF' && (
                <motion.div
                  key="pdf"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[500px] text-center gap-4"
                >
                  <div className="text-5xl">🗂️</div>
                  <p className="text-white/50 text-sm">PDF viewer — embed your PDF URL here</p>
                  <div className="w-full max-w-3xl h-[500px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                    {note.pdfUrl ? (
                      <iframe src={note.pdfUrl} className="w-full h-full rounded-2xl" title="PDF Viewer" />
                    ) : (
                      <div className="text-center space-y-3">
                        <p className="text-white/30 text-sm">No PDF attached to this note.</p>
                        <button className="px-4 py-2 rounded-xl bg-violet-600/30 border border-violet-500/30 text-violet-300 text-sm">
                          Upload PDF
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Toolbar */}
          <div className="border-t border-white/5 bg-black/30 backdrop-blur-xl px-6 py-3">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {/* Mode Toggle */}
              <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                {(['2D', '3D', 'PDF'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      mode === m ? 'bg-violet-600 text-white shadow-md' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {m === '2D' ? '📄 2D' : m === '3D' ? '📦 3D' : '🗂️ PDF'}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFontSize(s => Math.max(12, s - 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 text-white/50 hover:text-white text-sm transition"
                >A-</button>
                <span className="text-xs text-white/30">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(s => Math.min(22, s + 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 text-white/50 hover:text-white text-sm transition"
                >A+</button>

                <button
                  onClick={() => setNightMode(n => !n)}
                  className={`w-7 h-7 rounded-lg text-sm transition ${nightMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/5 text-white/50 hover:text-white'}`}
                  title="Night Mode"
                >🌙</button>

                <button
                  onClick={() => setBookmarked(b => !b)}
                  className={`w-7 h-7 rounded-lg text-sm transition ${bookmarked ? 'bg-orange-500/20 text-orange-300' : 'bg-white/5 text-white/50 hover:text-white'}`}
                  title="Bookmark"
                >{bookmarked ? '🔖' : '📌'}</button>

                <button
                  className="w-7 h-7 rounded-lg bg-white/5 text-white/50 hover:text-white text-sm transition"
                  title="Share"
                >🔗</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
