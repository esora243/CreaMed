"use client";

import type { VoiceChatStatus } from "@/types/chat";

interface Props {
  status: VoiceChatStatus;
  audioLevel: number;
}

export function VoiceVisualizer({ status, audioLevel }: Props) {
  // ステータスごとに色とアニメーションを切り替え
  const colorMap: Record<VoiceChatStatus, string> = {
    idle: "from-kokoro-green to-[#B8D4B8]",
    listening: "from-kokoro-peach to-[#F0A998]",
    processing: "from-[#E8D6C2] to-kokoro-beige",
    speaking: "from-kokoro-orange to-[#E89968]",
    error: "from-kokoro-alert to-[#A55C48]",
  };

  // listening 時は音量で拡大
  const scale =
    status === "listening" ? 1 + Math.min(audioLevel * 0.6, 0.6) : 1;

  const isPulsing = status === "idle" || status === "processing";
  const isRippling = status === "speaking";

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {isRippling && (
        <>
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorMap[status]} opacity-40 animate-ripple`}
          />
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorMap[status]} opacity-30 animate-ripple`}
            style={{ animationDelay: "0.4s" }}
          />
        </>
      )}
      <div
        className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${colorMap[status]} shadow-lg transition-transform duration-150 ${
          isPulsing ? "animate-breathe" : ""
        }`}
        style={{
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
