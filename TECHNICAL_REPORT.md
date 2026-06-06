# Kokoro Voice 技術レポート

## 1. プロジェクト概要

「Kokoro Voice」は、うつ病や気分の落ち込みについて、ユーザーが**音声通話に近い体験**でAIに相談できるWebアプリです。医療行為の禁止・傾聴・危機エスカレーションを最優先に設計しました。

---

## 2. アーキテクチャ全体像

```
┌──────────────────────────────────────────────────────────┐
│  ブラウザ (Client Component)                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ChatContainer                                      │  │
│  │    ├── VoiceVisualizer (呼吸する円)                 │  │
│  │    ├── MicButton                                    │  │
│  │    ├── MessageList                                  │  │
│  │    └── CrisisBanner / ConsentDialog                 │  │
│  └────────────────────────────────────────────────────┘  │
│         │                                                 │
│         ▼ useVoiceChat (司令塔)                            │
│  ┌─────────────────┬──────────────────┬───────────────┐  │
│  │ useSpeechRecog. │ useSpeechSynth.  │ useAudioLevel │  │
│  │  (STT/ja-JP)    │  (TTS/句点単位)   │  (波形描画用)  │  │
│  └─────────────────┴──────────────────┴───────────────┘  │
│         │                                                 │
└─────────┼─────────────────────────────────────────────────┘
          │ fetch (SSE)
          ▼
┌──────────────────────────────────────────────────────────┐
│  Next.js API Route: /api/chat                             │
│    ├── crisisDetector で危機ワード判定                       │
│    ├── 必要に応じて CRISIS_AUGMENT をプロンプトに合成          │
│    └── OpenAI Chat Completions (stream=true) を中継        │
└──────────────────────────────────────────────────────────┘
          │
          ▼
       OpenAI API (gpt-4o-mini)
```

---

## 3. ディレクトリ構成

```
kokoro-voice/
├── app/
│   ├── api/chat/route.ts        # OpenAIストリーミング中継
│   ├── chat/page.tsx            # 対話画面ルート
│   ├── page.tsx                 # ランディング
│   ├── layout.tsx               # 共通レイアウト
│   └── globals.css              # Tailwindベース + カスタム変数
├── components/
│   ├── chat/                    # 対話UI部品
│   ├── safety/                  # 同意ダイアログ・危機バナー
│   └── ui/
├── hooks/
│   ├── useVoiceChat.ts          # 司令塔フック
│   ├── useSpeechRecognition.ts  # Web Speech API ラッパ
│   ├── useSpeechSynthesis.ts    # TTSキュー管理
│   ├── useAudioLevel.ts         # マイク音量取得
│   └── useChatHistory.ts        # localStorage永続化
├── lib/
│   ├── prompts/systemPrompt.ts  # ⭐ システムプロンプト本体
│   ├── safety/crisisDetector.ts # 危機ワード辞書 + 検出関数
│   ├── utils/messageSanitizer.ts# 読み上げ用整形 + 文分割
│   ├── utils/speechConfig.ts    # ja-JP音声選定
│   └── openai.ts                # OpenAIクライアント
├── types/
│   ├── chat.ts
│   └── speech.d.ts              # Web Speech API型定義
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## 4. 主要な実装ポイント

### 4.1 状態機械

`useVoiceChat` は以下5状態を持ち、UIの色・アニメーションは `VoiceVisualizer` がこの状態にバインドされます。

```
idle ──(マイクON)──> listening ──(無音1.8s)──> processing 
                                                  │
                                                  ▼
                                  speaking <── responding
                                     │
                                     └──(読み上げ完了)──> idle
```

### 4.2 ストリーミング読み上げ

最大のUX工夫ポイント。OpenAIのSSEレスポンスを `句点(。!?\n)` 単位で `splitBySentence()` に流し込み、文ができ次第 `SpeechSynthesisUtterance` のキューに投入します。これにより**最初の一文目を1秒以内に読み始める**ことが可能になり、ユーザーの待ち時間ストレスを大幅に軽減します。

### 4.3 自動ターン制御

`SpeechRecognition` の `interimTranscript` を監視し、1.8秒間更新されなければ自動的に発話終了とみなして送信します。ユーザーは「話し終えるタイミング」を意識する必要がありません。

### 4.4 割り込み (Barge-in)

AI発話中にユーザーがマイクボタンを押すと、`speechSynthesis.cancel()` と `AbortController.abort()` で即座に停止し、新しい入力モードへ移行します。

### 4.5 危機検知の二段構え

- **クライアント側** (`crisisDetector.ts`): 高リスクワード(「死にたい」等)を検出すると `CrisisBanner` を即時表示
- **サーバー側** (`/api/chat/route.ts`): 同じ検出ロジックで `CRISIS_AUGMENT` をシステムプロンプトに合成し、LLMが確実に専門窓口を案内するよう強制

両側で独立して動作させることで、片方が漏れてもユーザーに窓口情報が届きます。

### 4.6 安全プロンプト

`lib/prompts/systemPrompt.ts` に集約。以下を厳格に規定:

| カテゴリ | 内容 |
|---------|------|
| 基本姿勢 | 否定せず受け止める / 感情の反射 / 沈黙の尊重 |
| 禁止事項 | 診断・薬の推奨・治療指示・苦しみの軽視 |
| 返答形式 | 80文字目安・Markdown禁止・話し言葉のみ |
| 進行 | 受容→感情反射→開かれた質問1つ |
| 危機対応 | 専門窓口の具体的な番号を案内 |

---

## 5. UI/UXデザイン

| 要素 | 設計 |
|------|------|
| 配色 | `#FFF9FA`(オフホワイト)→ `#FAF3E8`(ベージュ)のグラデ |
| メインモチーフ | 中央の「呼吸する円」が状態を表現 |
| `idle` | ペールグリーン、ゆっくり拍動 |
| `listening` | ピーチ、音量で拡大 |
| `speaking` | オレンジ、波紋エフェクト |
| フォント | Noto Sans JP / line-height 1.8 |
| 認知負荷 | 画面上の常時表示要素を最小化(ヘッダー + 円 + 状態テキスト + マイクボタン) |

---

## 6. 既知の制約と今後の拡張

| 制約 | 対応案 |
|------|--------|
| Safari の Web Speech API 未対応 | `/api/stt` (Whisper) と `/api/tts` (OpenAI TTS) のフォールバックAPI Route を追加 |
| TTS品質 (ブラウザ依存) | OpenAI TTS-1-hd または ElevenLabs への切替を `useSpeechSynthesis` 内に分岐 |
| 端末跨ぎの永続化なし | Supabase Auth + DB で会話を保存 |
| 危機検知が単純な辞書ベース | LLM分類モデルや、より細やかな感情解析の導入 |
| 多言語 | i18next 導入、システムプロンプトをロケール別に |

---

## 7. デプロイ手順 (Vercel)

1. GitHubにプッシュ
2. Vercel で Import Project
3. Environment Variables に `OPENAI_API_KEY` を追加
4. `npm run build` が通ることを確認 → Deploy

Node Runtime で動作します(Edge Runtime に切り替える場合は `openai` SDKの代わりに `fetch` 直叩きへの書き換えが必要)。

---

## 8. セキュリティ・プライバシー

- APIキーはサーバー側 (`/api/chat`) でのみ使用、フロントには露出しない
- 会話履歴はブラウザの localStorage のみに保存、サーバーには永続化しない
- 初回起動時に同意ダイアログで利用範囲と免責事項を明示

---

## 9. ファイル一覧 (主要)

| パス | 役割 |
|------|------|
| `app/api/chat/route.ts` | OpenAI中継・危機検知合成 |
| `hooks/useVoiceChat.ts` | 司令塔フック |
| `hooks/useSpeechRecognition.ts` | STTラッパ |
| `hooks/useSpeechSynthesis.ts` | TTSキュー |
| `lib/prompts/systemPrompt.ts` | システムプロンプト |
| `lib/safety/crisisDetector.ts` | 危機検知 |
| `components/chat/ChatContainer.tsx` | 画面統合 |
| `components/chat/VoiceVisualizer.tsx` | 呼吸する円 |
| `components/safety/CrisisBanner.tsx` | 危機バナー |

以上。
