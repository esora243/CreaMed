import { NextRequest } from "next/server";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai";
import { SYSTEM_PROMPT, CRISIS_AUGMENT } from "@/lib/prompts/systemPrompt";
import { detectCrisis } from "@/lib/safety/crisisDetector";
import type { Message } from "@/types/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  messages: Message[];
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages is required", { status: 400 });
  }

  // 直近のユーザー発言から危機検知
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const crisis = lastUser ? detectCrisis(lastUser.content) : null;

  const systemContent =
    crisis === "high" ? `${SYSTEM_PROMPT}\n\n${CRISIS_AUGMENT}` : SYSTEM_PROMPT;

  let client;
  try {
    client = getOpenAIClient();
  } catch (e) {
    return new Response("OPENAI_API_KEY is not configured", { status: 500 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await client.chat.completions.create({
          model: OPENAI_MODEL,
          stream: true,
          temperature: 0.7,
          max_tokens: 300,
          messages: [
            { role: "system", content: systemContent },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ] as any,
        });

        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      } catch (err: any) {
        controller.enqueue(
          encoder.encode(
            "\n申し訳ありません、少し接続が乱れてしまいました。もう一度お話ししてもらえますか。"
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Crisis-Level": crisis ?? "none",
    },
  });
}
