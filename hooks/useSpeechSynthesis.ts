"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  pickJapaneseVoice,
  SPEECH_PITCH,
  SPEECH_RATE,
  SPEECH_VOLUME,
} from "@/lib/utils/speechConfig";
import { sanitizeForSpeech } from "@/lib/utils/messageSanitizer";

interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  speak: (text: string, onEnd?: () => void) => void;
  cancel: () => void;
}

/**
 * 文単位でキューイングし、ストリーミング応答にも対応する読み上げフック。
 */
export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const queueRef = useRef<{ text: string; onEnd?: () => void }[]>([]);
  const playingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, []);

  const playNext = useCallback(() => {
    if (typeof window === "undefined") return;
    if (playingRef.current) return;
    const next = queueRef.current.shift();
    if (!next) {
      setIsSpeaking(false);
      return;
    }
    playingRef.current = true;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(sanitizeForSpeech(next.text));
    utterance.lang = "ja-JP";
    utterance.rate = SPEECH_RATE;
    utterance.pitch = SPEECH_PITCH;
    utterance.volume = SPEECH_VOLUME;

    const voice = pickJapaneseVoice(window.speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      playingRef.current = false;
      next.onEnd?.();
      playNext();
    };
    utterance.onerror = () => {
      playingRef.current = false;
      playNext();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!text.trim()) return;
      queueRef.current.push({ text, onEnd });
      playNext();
    },
    [playNext]
  );

  const cancel = useCallback(() => {
    if (typeof window === "undefined") return;
    queueRef.current = [];
    playingRef.current = false;
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setIsSpeaking(false);
  }, []);

  return { isSupported, isSpeaking, voices, speak, cancel };
}
