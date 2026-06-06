"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "kokoro-voice-consent-v1";

export function ConsentDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const ok = localStorage.getItem(CONSENT_KEY);
      if (!ok) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-medium text-kokoro-ink">
          はじめに、お伝えしたいこと
        </h2>
        <div className="text-sm leading-relaxed space-y-2 text-kokoro-ink/90">
          <p>
            このアプリのAIは、医療従事者ではありません。診断や治療、薬の相談には対応できません。
          </p>
          <p>
            お話しした内容は、あなたのブラウザにのみ保存されます(いつでも消去できます)。
          </p>
          <p>
            つらい気持ちが強い時や、安全が心配な時は、以下の窓口にもぜひご相談ください。
          </p>
          <ul className="text-xs text-kokoro-mute pl-4 list-disc">
            <li>こころの健康相談統一ダイヤル: 0570-064-556</li>
            <li>よりそいホットライン: 0120-279-338</li>
            <li>緊急時: 119 / 110</li>
          </ul>
        </div>
        <button
          onClick={accept}
          className="w-full py-3 rounded-full bg-kokoro-orange text-white font-medium hover:opacity-90 transition"
        >
          理解しました
        </button>
      </div>
    </div>
  );
}
