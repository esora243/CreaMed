import type { CrisisLevel } from "@/types/chat";

const HIGH_KEYWORDS = [
  "死にたい",
  "しにたい",
  "消えたい",
  "きえたい",
  "自殺",
  "殺して",
  "ころして",
  "いなくなりたい",
  "飛び降り",
  "とびおり",
  "首を吊",
  "首つり",
  "リストカット",
  "リスカ",
  "オーバードーズ",
  "OD",
  "od",
];

const MEDIUM_KEYWORDS = [
  "もうだめ",
  "もうダメ",
  "生きていたくない",
  "生きてたくない",
  "価値がない",
  "誰もわかってくれない",
  "限界",
  "絶望",
  "何もしたくない",
];

export function detectCrisis(text: string): CrisisLevel {
  const normalized = text.toLowerCase();
  if (HIGH_KEYWORDS.some((k) => normalized.includes(k.toLowerCase()))) {
    return "high";
  }
  if (MEDIUM_KEYWORDS.some((k) => normalized.includes(k.toLowerCase()))) {
    return "medium";
  }
  return null;
}
