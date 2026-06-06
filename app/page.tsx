import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center space-y-8 py-16">
        <div className="space-y-3">
          <div className="inline-block">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-kokoro-peach to-kokoro-orange opacity-90 animate-breathe" />
          </div>
          <h1 className="text-3xl font-medium text-kokoro-ink">Kokoro Voice</h1>
          <p className="text-kokoro-mute text-sm">
            こころに寄り添う、対話のパートナー
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur rounded-2xl p-6 text-left space-y-3 text-sm leading-relaxed">
          <p>
            このアプリは、気分の落ち込みや不安を、安心して話せる場所を目指してつくられました。
          </p>
          <p className="text-kokoro-mute">
            ・AIは医療従事者ではなく、診断や治療は行いません。<br />
            ・話した内容はあなたのブラウザにのみ保存されます。<br />
            ・つらい時は、専門の相談窓口の利用もご検討ください。
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-block px-8 py-4 rounded-full bg-kokoro-orange text-white font-medium shadow-sm hover:opacity-90 transition"
        >
          話しはじめる
        </Link>

        <p className="text-xs text-kokoro-mute">
          こころの健康相談統一ダイヤル: 0570-064-556 / よりそいホットライン:
          0120-279-338
        </p>
      </div>
    </main>
  );
}
