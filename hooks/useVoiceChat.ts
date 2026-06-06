"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { useChatHistory } from "./useChatHistory";
import { useAudioLevel } from "./useAudioLevel";
import { detectCrisis } from "@/lib/safety/crisisDetector";
import { splitBySentence } from "@/lib/utils/messageSanitizer";
import type { CrisisLevel, Message, VoiceChatStatus } from "@/types/chat";

interface UseVoiceChatReturn {
  status: VoiceChatStatus;
  messages: Message[];
  interimTranscript: string;
  audioLevel: number;
  isSpeechSupported: boolean;
  crisisLevel: CrisisLevel;
  startListening: () => Promise<void>;
  stopListening: () => void;
  interrupt: () => void;
  clearHistory: () => void;
  sendText: (text: string) => Promise<void>;
}

const SILENCE_TIMEOUT_MS = 1800;

export function useVoiceChat(): UseVoiceChatReturn {
  const [status, setStatus] = useState<VoiceChatStatus>("idle");
  const [crisisLevel, setCrisisLevel] = useState<CrisisLevel>(null);

  const {
    messages,
    addMessage,
    updateLastAssistant,
    clear: clearHistory,
  } = useChatHistory();

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const handleFinalRef = useRef<(text: string) => void>(() => {});

  const {
    isSupported: srSupported,
    isListening,
    interimTranscript,
    start: startRecognition,
    stop: stopRecognition,
    reset: resetRecognition,
  } = useSpeechRecognition({
    lang: "ja-JP",
    continuous: true,
    interimResults: true,
    onFinalResult: (t) => handleFinalRef.current(t),
  });

  const {
    isSupported: ttsSupported,
    isSpeaking,
    speak,
    cancel: cancelSpeak,
  } = useSpeechSynthesis();

  const { audioLevel, start: startAudio, stop: stopAudio } = useAudioLevel();

  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  // ステータス同期
  useEffect(() => {
    if (isSpeaking) {
      setStatus("speaking");
    } else if (isListening) {
      setStatus("listening");
    } else if (status === "speaking" || status === "listening") {
      setStatus("idle");
    }
    // processing は手動でセットするのでここで戻さない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, isSpeaking]);

  const sendToLLM = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed) return;

      // 危機検知
      const crisis = detectCrisis(trimmed);
      if (crisis) setCrisisLevel(crisis);

      addMessage({ role: "user", content: trimmed });
      const assistantMsg = addMessage({ role: "assistant", content: "" });

      setStatus("processing");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messagesRef.current,
              {
                id: "tmp-user",
                role: "user",
                content: trimmed,
                createdAt: Date.now(),
              },
            ],
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error("network");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";
        let firstSentenceSpoken = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          full += chunk;
          updateLastAssistant(full);

          // 句点単位でTTSキューへ
          const { completed, remaining } = splitBySentence(buffer);
          if (completed.length) {
            if (!firstSentenceSpoken) {
              setStatus("speaking");
              firstSentenceSpoken = true;
            }
            completed.forEach((s) => speak(s));
            buffer = remaining;
          }
        }

        // 残りバッファをフラッシュ
        if (buffer.trim()) {
          if (!firstSentenceSpoken) setStatus("speaking");
          speak(buffer);
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          const fallback =
            "ごめんなさい、うまく返事ができませんでした。もう一度お話ししてもらえますか。";
          updateLastAssistant(fallback);
          speak(fallback);
        }
      } finally {
        abortRef.current = null;
      }
    },
    [addMessage, updateLastAssistant, speak]
  );

  // 無音タイマー: interimTranscript が一定時間更新されなければ送信
  useEffect(() => {
    if (!isListening) return;
    const current = interimTranscript.trim();
    if (!current) return;

    accumulatedRef.current = current;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      const text = accumulatedRef.current;
      if (text) {
        stopRecognition();
        resetRecognition();
        accumulatedRef.current = "";
        sendToLLM(text);
      }
    }, SILENCE_TIMEOUT_MS);

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [interimTranscript, isListening, sendToLLM, stopRecognition, resetRecognition]);

  // 確定結果が来た場合(SpeechRecognition の onFinalResult)
  useEffect(() => {
    handleFinalRef.current = (text: string) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      accumulatedRef.current = "";
      stopRecognition();
      resetRecognition();
      sendToLLM(text);
    };
  }, [sendToLLM, stopRecognition, resetRecognition]);

  const startListening = useCallback(async () => {
    cancelSpeak();
    await startAudio();
    startRecognition();
    setStatus("listening");
  }, [cancelSpeak, startAudio, startRecognition]);

  const stopListening = useCallback(() => {
    stopRecognition();
    stopAudio();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const text = accumulatedRef.current.trim();
    accumulatedRef.current = "";
    if (text) {
      sendToLLM(text);
    } else {
      setStatus("idle");
    }
  }, [stopRecognition, stopAudio, sendToLLM]);

  const interrupt = useCallback(() => {
    cancelSpeak();
    abortRef.current?.abort();
    setStatus("idle");
  }, [cancelSpeak]);

  const sendText = useCallback(
    async (text: string) => {
      cancelSpeak();
      await sendToLLM(text);
    },
    [cancelSpeak, sendToLLM]
  );

  return {
    status,
    messages,
    interimTranscript,
    audioLevel,
    isSpeechSupported: srSupported && ttsSupported,
    crisisLevel,
    startListening,
    stopListening,
    interrupt,
    clearHistory,
    sendText,
  };
}
