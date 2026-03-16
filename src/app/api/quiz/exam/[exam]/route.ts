import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import ExamWords from "@/models/ExamWords";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getRandomIndices(length: number, count: number) {
  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * length));
  }
  return Array.from(indices);
}

function shuffleArray(array: string[]) {
  return array.sort(() => Math.random() - 0.5);
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const url = req.nextUrl;
    const exam = url.pathname.split("/").pop();

    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam parameter is missing." },
        { status: 400 }
      );
    }

    const examDoc = await ExamWords.findOne({
      exam: new RegExp(`^${exam}$`, "i"),
    });

    if (!examDoc || examDoc.words.length < 1) {
      return NextResponse.json(
        { success: false, error: `No words found for exam '${exam}'.` },
        { status: 404 }
      );
    }

    const total = examDoc.words.length;
    const indices = getRandomIndices(total, Math.min(5, total));
    const selectedWordObjs = indices.map((i) => examDoc.words[i]);
    const selectedWords = selectedWordObjs.map((w) => w.word);

    const prompt = `
You're an expert exam coach. Create ${
      selectedWords.length
    } beginner-friendly vocabulary quiz questions designed for the "${exam
      .replace("-", " ")
      .toUpperCase()}" exam.

Each quiz question must be a JSON object with these fields:
{
  "word": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "explanation": "string"
}

Rules:
- Use the words: ${selectedWords.join(", ")}
- Each question should ask the meaning or best synonym.
- Options must be realistic but not confusing.
- Explanations should be simple and informative.
- Format output as a JSON array. No extra commentary.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.choices[0].message.content || "[]";

    let parsed: any[];
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.log("❌ JSON Parse Error:", raw);
      throw new Error("OpenAI returned invalid JSON format.");
    }

    const enriched = parsed.map((q: any) => {
      const match = selectedWordObjs.find(
        (w) => w.word.toLowerCase() === q.word.toLowerCase()
      );
      return {
        ...q,
        imageURL: match?.imageURL || null,
        options: shuffleArray([...q.options]),
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (err: any) {
    console.log("❌ Exam Quiz API Error:", err.stack || err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate quiz." },
      { status: 500 }
    );
  }
}
