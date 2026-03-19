import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set");
  }

  return new OpenAI({ apiKey });
}

export function parseOpenAIJson<T>(content: string | null | undefined): T {
  const normalized = (content || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(normalized) as T;
}

export async function getRandomWordFromOpenAI(): Promise<string> {
  const openai = getOpenAIClient();
  const prompt = "Give me a single rare English word (no meaning), one word only.";
  const res = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [{ role: "user", content: prompt }],
  });
  return res.choices[0].message.content?.trim() || "";
}

export { getOpenAIClient };
