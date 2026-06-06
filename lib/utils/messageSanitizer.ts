/**
 * LLMの出力を音声読み上げに適した形に整える。
 * - Markdown記号、絵文字、不要な括弧を除去
 * - 連続する空白の正規化
 */
export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/[*_`#>~\-]+/g, "") // Markdown
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // [text](url) → text
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/gu,
      ""
    ) // emoji
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * ストリームから到着したテキストを文単位に分割する。
 * - 句点(。)、感嘆符(!?), 改行で区切る
 * - 区切られた完成文と、まだ未確定の残りを返す
 */
export function splitBySentence(buffer: string): {
  completed: string[];
  remaining: string;
} {
  const regex = /[^。!?！?\n]+[。!?！?\n]/g;
  const completed = buffer.match(regex) ?? [];
  const consumed = completed.join("");
  const remaining = buffer.slice(consumed.length);
  return {
    completed: completed.map((s) => s.trim()).filter(Boolean),
    remaining,
  };
}
