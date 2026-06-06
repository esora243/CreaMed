"use client";

import type { CrisisLevel } from "@/types/chat";

interface Props {
  level: CrisisLevel;
}

export function CrisisBanner({ level }: Props) {
  if (!level) return null;

  const isHigh = level === "high";

  return (
    <div
      role="alert"
      className={`fixed top-0 inset-x-0 z-50 px-4 py-3 text-sm leading-relaxed ${
        isHigh ? "bg-kokoro-alert text-white" : "bg-kokoro-orange/90 text-white"
      }`}
    >
      <div className="max-w-2xl mx-auto space-y-1">
        <p className="font-medium">
          {isHigh
            ? "あなたのことが心配です。一人で抱え込まないでください。"
            : "つらい時は、専門の方に話してみるのも一つの方法です。"}
        </p>
        <p className="text-xs opacity-95">
          こころの健康相談統一ダイヤル{" "}
          <a href="tel:0570-064-556" className="underline font-medium">
            0570-064-556
          </a>{" "}
          / よりそいホットライン{" "}
          <a href="tel:0120-279-338" className="underline font-medium">
            0120-279-338
          </a>
          {isHigh && (
            <>
              {" "}
              / 緊急時{" "}
              <a href="tel:119" className="underline font-medium">
                119
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
