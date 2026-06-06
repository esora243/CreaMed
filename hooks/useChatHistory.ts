"use client";

import { useCallback, useEffect, useState } from "react";
import type { Message } from "@/types/chat";

const STORAGE_KEY = "kokoro-voice-history-v1";

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        setMessages(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, hydrated]);

  const addMessage = useCallback((msg: Omit<Message, "id" | "createdAt">) => {
    const m: Message = {
      ...msg,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, m]);
    return m;
  }, []);

  const updateLastAssistant = useCallback((content: string) => {
    setMessages((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].role === "assistant") {
          next[i] = { ...next[i], content };
          return next;
        }
      }
      return prev;
    });
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { messages, addMessage, updateLastAssistant, clear, hydrated };
}
