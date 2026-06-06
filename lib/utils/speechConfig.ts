/**
 * 日本語TTSに最適な声を探す。
 * - Google日本語 / Kyoko / Otoya などを優先
 */
export function pickJapaneseVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const jaVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("ja"));
  if (!jaVoices.length) return null;

  const preferred = [
    "Google 日本語",
    "Google Japanese",
    "Kyoko",
    "O-ren",
    "Otoya",
    "Hattori",
  ];
  for (const name of preferred) {
    const v = jaVoices.find((vo) => vo.name.includes(name));
    if (v) return v;
  }
  // 女性的な声を優先
  const female = jaVoices.find((v) => /female|woman|kyoko/i.test(v.name));
  return female ?? jaVoices[0];
}

export const SPEECH_RATE = 0.95;
export const SPEECH_PITCH = 1.0;
export const SPEECH_VOLUME = 1.0;
