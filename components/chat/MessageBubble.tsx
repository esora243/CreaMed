"use client";

import type { Message } from "@/types/chat";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-kokoro-peach/50 text-kokoro-ink rounded-tr-sm"
            : "bg-white/80 text-kokoro-ink rounded-tl-sm shadow-sm"
        }`}
      >
        {message.content || (
          <span className="text-kokoro-mute">…</span>
        )}
      </div>
    </div>
  );
}
