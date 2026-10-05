'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface CopilotContext {
  subject?: string;
  topic?: string;
}

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: CopilotContext;
}

// ─── Quick Question Suggestions ───────────────────────────────────────────────

const QUICK_QUESTIONS = [
  { label: 'Explain this concept', icon: '💡' },
  { label: 'Show worked example', icon: '📐' },
  { label: 'What are common mistakes?', icon: '⚠️' },
  { label: 'Give me a harder problem', icon: '🔥' },
];

// ─── Phoenix Icon ─────────────────────────────────────────────────────────────

function PhoenixIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 3C16 3 10 8 10 14C10 17.3 11.8 20.2 14.5 21.8L13 29H19L17.5 21.8C20.2 20.2 22 17.3 22 14C22 8 16 3 16 3Z"
        fill="url(#phoenix-grad)"
      />
      <path
        d="M16 12C16 12 12 15 11 19C10.2 22 11 25 13 27"
        stroke="#FFAA00"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M16 12C16 12 20 15 21 19C21.8 22 21 25 19 27"
        stroke="#FF6B00"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="16" cy="14" r="3" fill="#FFD700" />
      <defs>
        <linearGradient id="phoenix-grad" x1="10" y1="3" x2="22" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#FF3300" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Thinking Indicator ───────────────────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-start gap-3 mb-4"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
        <PhoenixIcon className="w-5 h-5" />
      </div>

      {/* Bubble */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-orange-300/70 text-sm font-medium mr-1">Thinking</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-orange-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-mono text-orange-300/70 uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: 'rgba(0,0,0,0.4)',
          fontSize: '0.8rem',
          padding: '1rem',
        }}
        showLineNumbers={children.split('\n').length > 4}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

// ─── AI Message Bubble ────────────────────────────────────────────────────────

function AIMessage({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex items-start gap-3 mb-4"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30 mt-0.5">
        <PhoenixIcon className="w-5 h-5" />
      </div>

      {/* Bubble */}
      <div className="max-w-[88%] bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 shadow-lg">
        <div className="prose prose-invert prose-sm max-w-none
          prose-p:leading-relaxed prose-p:mb-2 prose-p:last:mb-0
          prose-headings:text-orange-300 prose-headings:font-semibold
          prose-strong:text-white prose-em:text-orange-200/80
          prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
          prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-orange-500 prose-blockquote:text-white/60
          prose-hr:border-white/10
        ">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const lang = match ? match[1] : '';
                const codeStr = String(children).replace(/\n$/, '');

                if (!inline && (match || codeStr.includes('\n'))) {
                  return <CodeBlock language={lang}>{codeStr}</CodeBlock>;
                }

                return (
                  <code
                    className="px-1.5 py-0.5 rounded-md bg-white/10 text-orange-300 font-mono text-[0.78em]"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Override table styling
              table({ children }: any) {
                return (
                  <div className="overflow-x-auto my-3">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                );
              },
              th({ children }: any) {
                return (
                  <th className="px-3 py-2 bg-orange-500/20 border border-white/10 text-orange-300 font-semibold text-left">
                    {children}
                  </th>
                );
              },
              td({ children }: any) {
                return (
                  <td className="px-3 py-2 border border-white/10 text-white/80">{children}</td>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-[10px] text-white/25">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── User Message Bubble ──────────────────────────────────────────────────────

function UserMessage({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex items-end justify-end gap-3 mb-4"
    >
      <div className="max-w-[80%] space-y-2">
        {/* Image preview if any */}
        {message.imageUrl && (
          <div className="flex justify-end">
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="max-h-48 rounded-xl rounded-br-none border border-orange-500/30 object-cover"
            />
          </div>
        )}

        {/* Text bubble */}
        {message.content && (
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl rounded-br-none px-4 py-3 shadow-lg shadow-orange-500/20">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <div className="mt-1.5 text-[10px] text-white/50 text-right">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg mb-0.5">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>
    </motion.div>
  );
}

// ─── Main CopilotPanel ────────────────────────────────────────────────────────

export default function CopilotPanel({ isOpen, onClose, context }: CopilotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ file: File; base64: string; previewUrl: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ── Auto-resize textarea ────────────────────────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  // ── Close on Escape ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // ── Image picker ────────────────────────────────────────────────────────────
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage({ file, base64: result, previewUrl: result });
    };
    reader.readAsDataURL(file);

    // Reset file input so re-selecting same file works
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // ── Voice input ─────────────────────────────────────────────────────────────
  const toggleVoiceInput = useCallback(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setRecognitionError('Voice input not supported in this browser.');
      setTimeout(() => setRecognitionError(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setRecognitionError('Could not capture voice. Try again.');
      setTimeout(() => setRecognitionError(null), 3000);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText && !selectedImage) return;
    if (isThinking) return;

    // Build user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: messageText,
      imageUrl: selectedImage?.previewUrl,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const capturedImage = selectedImage;
    setSelectedImage(null);
    setIsThinking(true);

    // Build history payload (last 10 messages)
    const history = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history,
          imageBase64: capturedImage?.base64 ?? null,
          context,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI Copilot is temporarily unavailable.');
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: 'ai',
          content: error instanceof Error ? error.message : 'Something went wrong connecting to the AI.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }, [input, selectedImage, isThinking, messages, context]);

  // ── Handle Enter key ────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            key="copilot-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* Panel */}
          <motion.div
            key="copilot-panel"
            ref={panelRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className={`
              fixed right-0 top-0 z-50 h-full w-full max-w-[420px]
              flex flex-col
              bg-[#0d0f14]/95 backdrop-blur-2xl
              border-l border-white/10
              shadow-2xl shadow-black/50
            `}
            style={{
              background: 'linear-gradient(160deg, rgba(20,14,6,0.97) 0%, rgba(10,10,18,0.97) 100%)',
            }}
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
            </div>

            {/* ── Header ── */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/10 flex-shrink-0">
              {/* Phoenix icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <PhoenixIcon className="w-6 h-6" />
              </div>

              {/* Title + context */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold text-base leading-tight">AI Copilot</h2>
                {(context?.subject || context?.topic) && (
                  <p className="text-orange-300/70 text-xs mt-0.5 truncate">
                    {[context.subject, context.topic].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>

              {/* Status dot */}
              <div className="flex items-center gap-1.5 mr-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-green-400/70">Online</span>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Message Thread ── */}
            <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-1 scroll-smooth">
              {/* Empty state: quick suggestions */}
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-5 pt-4"
                  >
                    {/* Welcome */}
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-xl shadow-orange-500/30">
                        <PhoenixIcon className="w-9 h-9" />
                      </div>
                      <h3 className="text-white font-semibold text-lg">Hey, I'm your Copilot! 🔥</h3>
                      <p className="text-white/50 text-sm max-w-[280px] mx-auto leading-relaxed">
                        Ask me anything about{' '}
                        <span className="text-orange-300">
                          {context?.subject ?? 'your subjects'}
                        </span>. I can solve problems, explain concepts, and more.
                      </p>
                    </div>

                    {/* Quick questions */}
                    <div className="space-y-2">
                      <p className="text-white/30 text-xs font-medium uppercase tracking-wider pl-1">Quick questions</p>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_QUESTIONS.map((q) => (
                          <motion.button
                            key={q.label}
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => sendMessage(q.label)}
                            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 text-left transition-all group"
                          >
                            <span className="text-lg flex-shrink-0">{q.icon}</span>
                            <span className="text-white/70 text-xs leading-tight group-hover:text-white/90 transition-colors">
                              {q.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              {messages.map((msg) =>
                msg.role === 'ai' ? (
                  <AIMessage key={msg.id} message={msg} />
                ) : (
                  <UserMessage key={msg.id} message={msg} />
                )
              )}

              {/* Thinking indicator */}
              <AnimatePresence>{isThinking && <ThinkingIndicator key="thinking" />}</AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div className="relative flex-shrink-0 border-t border-white/10 px-4 pt-3 pb-4 space-y-3">
              {/* Image preview */}
              <AnimatePresence>
                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10"
                  >
                    <img
                      src={selectedImage.previewUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs font-medium truncate">{selectedImage.file.name}</p>
                      <p className="text-white/40 text-xs">{(selectedImage.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all flex-shrink-0"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Voice error */}
              <AnimatePresence>
                {recognitionError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400/80 text-xs text-center"
                  >
                    {recognitionError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Input row */}
              <div className="flex items-end gap-2">
                {/* Text input */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    disabled={isThinking}
                    className={`
                      w-full resize-none rounded-2xl
                      bg-white/5 border border-white/10
                      focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20
                      text-white placeholder-white/25 text-sm
                      px-4 py-3 pr-3
                      outline-none transition-all
                      scrollbar-thin scrollbar-thumb-white/10
                      disabled:opacity-50
                    `}
                    style={{ lineHeight: '1.5', minHeight: '44px' }}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 pb-0.5">
                  {/* Camera / Image upload */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isThinking}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all
                      ${selectedImage
                        ? 'bg-orange-500/30 border border-orange-500/50 text-orange-300'
                        : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                      }
                      disabled:opacity-50
                    `}
                    title="Attach image"
                  >
                    <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />

                  {/* Microphone */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVoiceInput}
                    disabled={isThinking}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all relative
                      ${isListening
                        ? 'bg-red-500/30 border border-red-500/50 text-red-400'
                        : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                      }
                      disabled:opacity-50
                    `}
                    title={isListening ? 'Stop recording' : 'Voice input'}
                  >
                    {isListening && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-red-500/60"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </motion.button>

                  {/* Send */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => sendMessage()}
                    disabled={isThinking || (!input.trim() && !selectedImage)}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all relative overflow-hidden
                      ${!isThinking && (input.trim() || selectedImage)
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40'
                        : 'bg-white/5 border border-white/10 text-white/20'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title="Send message"
                  >
                    {/* Neon glow */}
                    {!isThinking && (input.trim() || selectedImage) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-amber-400/30"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Footer hint */}
              <p className="text-center text-white/20 text-[10px]">
                Enter to send · Shift+Enter for new line · Powered by Gemini
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
