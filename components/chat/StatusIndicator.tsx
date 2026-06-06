"use client";

import type { VoiceChatStatus } from "@/types/chat";

interface Props {
  status: VoiceChatStatus;
  interimTranscript?: string;
}

const STATUS_LABEL: Record<VoiceChatStatus, string> = {
  idle: "マイクボタンを押して、お話しください",
  listening: "聞いています…",
  processing: "考えています…",
  speaking: "お話ししています…",
  error: "うまく聞き取れませんでした",
};

export function StatusIndicator({ status, interimTranscript }: Props) {
  return (
    <div className="text-center space-y-2 min-h-[3rem]">
      <p className="text-kokoro-mute text-sm">{STATUS_LABEL[status]}</p>
      {status === "listening" && interimTranscript && (
        <p className="text-kokoro-ink text-base italic opacity-80">
          「{interimTranscript}」
        </p>
      )}
    </div>
  );
}
