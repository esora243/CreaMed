"use client";

import type { VoiceChatStatus } from "@/types/chat";

interface Props {
  status: VoiceChatStatus;
  onStart: () => void;
  onStop: () => void;
  onInterrupt: () => void;
  disabled?: boolean;
}

export function MicButton({
  status,
  onStart,
  onStop,
  onInterrupt,
  disabled,
}: Props) {
  const isListening = status === "listening";
  const isSpeaking = status === "speaking";

  const handleClick = () => {
    if (isListening) {
      onStop();
    } else if (isSpeaking) {
      onInterrupt();
    } else {
      onStart();
    }
  };

  const label = isListening
    ? "話し終える"
    : isSpeaking
      ? "止める"
      : "話しはじめる";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      className={`
        px-8 py-4 rounded-full text-white font-medium shadow-md
        transition-all duration-200 active:scale-95
        ${isListening ? "bg-kokoro-peach" : isSpeaking ? "bg-kokoro-mute" : "bg-kokoro-orange"}
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2
      `}
    >
      <MicIcon listening={isListening} />
      <span>{label}</span>
    </button>
  );
}

function MicIcon({ listening }: { listening: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {listening ? (
        <rect x="6" y="6" width="12" height="12" rx="2" />
      ) : (
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </>
      )}
    </svg>
  );
}
