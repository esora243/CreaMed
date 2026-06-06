# Kokoro Voice 🌿

うつ病や気分の落ち込みについて、自然な日本語で**音声通話のように相談できる**Webアプリ。

- **フロント**: Next.js 14 (App Router) + React 18 + Tailwind CSS
- **音声**: Web Speech API (SpeechRecognition / SpeechSynthesis)
- **AI**: OpenAI Chat Completions (gpt-4o-mini, ストリーミング)
- **デプロイ**: Vercel 想定

---

## クイックスタート

```bash
# 1. 依存をインストール
npm install

# 2. 環境変数を設定
cp .env.local.example .env.local
# .env.local を開いて OPENAI_API_KEY を設定

# 3. 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。
**Chrome / Edge** を推奨します(Web Speech API の対応のため)。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| 音声入力 | マイクボタンを押すと録音開始。1.8秒の無音で自動送信 |
| 音声出力 | AI応答を句点単位でストリーミング読み上げ |
| ハイブリッドUI | 音声に加え、テキスト入力・履歴閲覧も可能 |
| ローカル永続化 | 会話は localStorage に保存(いつでも消去可) |
| 危機検知 | 自傷・他害ワード検出時に専門窓口バナーを表示 |
| 安全プロンプト | 診断・薬の推奨を禁止する厳格なシステムプロンプト |

---

## 安全設計

このアプリは**医療行為を行いません**。
- LLMに渡すシステムプロンプトで、診断的発言・薬の推奨・治療指示を明示的に禁止
- 危機ワード検出時はサーバー側でプロンプトを増強し、相談窓口の案内を確実に応答に含める
- 初回起動時に同意ダイアログで免責を提示

---

## デプロイ (Vercel)

1. このリポジトリを GitHub にプッシュ
2. Vercel で New Project → リポジトリ選択
3. 環境変数 `OPENAI_API_KEY` を設定
4. デプロイ

---

## ライセンス

MIT
