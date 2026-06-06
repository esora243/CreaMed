"use client";

import { useState } from "react";
import Link from "next/link";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { StatusIndicator } from "./StatusIndicator";
import { MicButton } from "./MicButton";
import { MessageList } from "./MessageList";
import { CrisisBanner } from "@/components/safety/CrisisBanner";
import { ConsentDialog } from "@/components/safety/ConsentDialog";

export function ChatContainer() {
  const {
    status,
    messages,
    interimTranscript,
    audioLevel,
    isSpeechSupported,
    crisisLevel,
    startListening,
    stopListening,
    interrupt,
    clearHistory,
    sendText,
  } = useVoiceChat();

  const [showHistory, setShowHistory] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = textInput.trim();
    if (!t) return;
    setTextInput("");
    await sendText(t);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <ConsentDialog />
      <CrisisBanner level={crisisLevel} />

      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 py-3 text-sm">
        <Link href="/" className="text-kokoro-mute hover:text-kokoro-ink">
          ← 戻る
        </Link>
        <h1 className="text-kokoro-ink font-medium">こころ</h1>
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="text-kokoro-mute hover:text-kokoro-ink"
          aria-label="履歴を表示"
        >
          {showHistory ? "閉じる" : "履歴"}
        </button>
      </header>

      {/* メイン: ビジュアライザー */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <VoiceVisualizer status={status} audioLevel={audioLevel} />
        <StatusIndicator status={status} interimTranscript={interimTranscript} />

        {!isSpeechSupported && (
          <p className="text-xs text-kokoro-alert max-w-xs text-center">
            お使いのブラウザでは音声機能が使えないようです。下のテキスト入力でお話しできます。(Chrome / Edge を推奨)
          </p>
        )}

        <MicButton
          status={status}
          onStart={startListening}
          onStop={stopListening}
          onInterrupt={interrupt}
          disabled={!isSpeechSupported && status !== "idle"}
        />

        {/* テキスト入力(音声が使えない場合のフォールバック) */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex gap-2 px-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="文字でも話せます"
            className="flex-1 px-4 py-2 rounded-full bg-white/70 border border-kokoro-beige text-sm focus:outline-none focus:ring-2 focus:ring-kokoro-orange/40"
            disabled={status === "processing"}
          />
          <button
            type="submit"
            disabled={!textInput.trim() || status === "processing"}
            className="px-4 py-2 rounded-full bg-kokoro-ink/80 text-white text-sm disabled:opacity-40"
          >
            送る
          </button>
        </form>
      </div>

      {/* 履歴パネル */}
      {showHistory && (
        <div className="fixed inset-x-0 bottom-0 top-16 bg-white/95 backdrop-blur-md z-30 overflow-y-auto p-4 rounded-t-3xl shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">これまでのお話</h2>
              {messages.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("これまでの会話を消去しますか?")) clearHistory();
                  }}
                  className="text-xs text-kokoro-alert hover:underline"
                >
                  すべて消去
                </button>
              )}
            </div>
            <MessageList messages={messages} />
          </div>
        </div>
      )}
    </main>
  );
}
