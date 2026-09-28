/**
 * useCopilot.ts
 * AI Copilot chat hook for PhoenixLearn.
 * Handles text + image messages, streaming responses, and chat history.
 */

"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  imageBase64?: string; // base-64 data URI if the user attached an image
  timestamp: Date;
  isStreaming?: boolean; // true while this assistant message is being built
  error?: boolean;
}

export interface CopilotState {
  messages: Message[];
  isLoading: boolean;
  isOpen: boolean;
  hasImage: boolean; // true when a pending image has been attached
  pendingImage: string | null; // base-64 data URI of the attached image
}

export interface CopilotActions {
  sendMessage: (text: string, imageBase64?: string) => Promise<void>;
  clearChat: () => void;
  toggleOpen: () => void;
  uploadImage: (file: File) => Promise<void>;
  removePendingImage: () => void;
  open: () => void;
  close: () => void;
}

export type UseCopilotReturn = CopilotState & CopilotActions;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COPILOT_ENDPOINT = "/api/copilot";

const SYSTEM_PROMPT: Message = {
  id: "system-0",
  role: "system",
  content:
    "You are Phoenix, an enthusiastic and knowledgeable AI learning companion for PhoenixLearn. " +
    "Help students understand concepts clearly, encourage them when they struggle, and celebrate " +
    "their progress. Keep explanations concise, use analogies where helpful, and always respond " +
    "with warmth and positivity. Use markdown formatting where appropriate.",
  timestamp: new Date(),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generates a short unique ID for each message. */
function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Converts a File object to a base-64 data URI.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Builds the array of messages to send to the API, stripping internal fields.
 */
function buildApiPayload(messages: Message[]) {
  return messages.map(({ role, content, imageBase64 }) => ({
    role,
    content,
    ...(imageBase64 ? { imageBase64 } : {}),
  }));
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useCopilot()
 *
 * Full-featured AI copilot hook with streaming, image uploads, and persistent
 * chat history within the session.
 *
 * ```tsx
 * const { messages, isLoading, sendMessage, toggleOpen, uploadImage } = useCopilot();
 * ```
 */
export function useCopilot(): UseCopilotReturn {
  const [messages, setMessages] = useState<Message[]>([SYSTEM_PROMPT]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  // Keep a ref to the latest messages array so streaming callbacks can access
  // current state without stale closures.
  const messagesRef = useRef<Message[]>([SYSTEM_PROMPT]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Abort controller ref so in-flight requests can be cancelled
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ── sendMessage ────────────────────────────────────────────────────────────

  /**
   * Sends a user message (with optional image) to the /api/copilot endpoint.
   * Handles both streaming (text/event-stream) and JSON responses gracefully.
   */
  const sendMessage = useCallback(
    async (text: string, imageBase64?: string) => {
      const trimmed = text.trim();
      if (!trimmed && !imageBase64 && !pendingImage) return;

      // Abort any in-flight request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Determine which image to attach (explicit arg takes priority over pending)
      const attachedImage = imageBase64 ?? pendingImage ?? undefined;
      setPendingImage(null);

      // Build the user message
      const userMessage: Message = {
        id: uid(),
        role: "user",
        content: trimmed,
        ...(attachedImage ? { imageBase64: attachedImage } : {}),
        timestamp: new Date(),
      };

      // Placeholder assistant message that will be filled by streaming
      const assistantMessageId = uid();
      const assistantPlaceholder: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      const updatedMessages = [...messagesRef.current, userMessage];
      setMessages([...updatedMessages, assistantPlaceholder]);
      setIsLoading(true);

      try {
        const response = await fetch(COPILOT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: buildApiPayload(updatedMessages),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get("content-type") ?? "";

        // ── Streaming path ────────────────────────────────────────────────
        if (contentType.includes("text/event-stream") && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // Parse SSE lines: "data: <json>\n\n"
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const delta =
                  parsed?.choices?.[0]?.delta?.content ??
                  parsed?.content ??
                  parsed?.text ??
                  "";
                accumulated += delta;
              } catch {
                // Malformed chunk — skip
              }
            }

            // Update the streaming assistant message in place
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: accumulated, isStreaming: true }
                  : m
              )
            );
          }

          // Mark streaming complete
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: accumulated, isStreaming: false }
                : m
            )
          );
        } else {
          // ── JSON / non-streaming path ─────────────────────────────────
          const json = await response.json();
          const content =
            json?.choices?.[0]?.message?.content ??
            json?.content ??
            json?.message ??
            "Sorry, I couldn't generate a response.";

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content, isStreaming: false }
                : m
            )
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // Request was intentionally cancelled — remove the placeholder
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantMessageId)
          );
          return;
        }

        console.error("[useCopilot] sendMessage error:", err);

        // Show an error message in the chat
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content:
                    "Sorry, something went wrong. Please try again in a moment. 🦅",
                  isStreaming: false,
                  error: true,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [pendingImage]
  );

  // ── clearChat ─────────────────────────────────────────────────────────────

  /**
   * Clears the chat history, keeping only the system prompt.
   */
  const clearChat = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([SYSTEM_PROMPT]);
    setPendingImage(null);
    setIsLoading(false);
  }, []);

  // ── toggleOpen ────────────────────────────────────────────────────────────

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // ── uploadImage ───────────────────────────────────────────────────────────

  /**
   * Converts a File to a base-64 data URI and stores it as a pending image.
   * The image will be attached to the next `sendMessage` call.
   */
  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      console.warn("[useCopilot] uploadImage: not an image file");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setPendingImage(base64);
    } catch (err) {
      console.error("[useCopilot] uploadImage error:", err);
    }
  }, []);

  // ── removePendingImage ────────────────────────────────────────────────────

  const removePendingImage = useCallback(() => {
    setPendingImage(null);
  }, []);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    // State
    messages,
    isLoading,
    isOpen,
    hasImage: pendingImage !== null,
    pendingImage,
    // Actions
    sendMessage,
    clearChat,
    toggleOpen,
    uploadImage,
    removePendingImage,
    open,
    close,
  };
}

export default useCopilot;
