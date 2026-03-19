import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { getOpenAIClient, parseOpenAIJson } from "@/lib/openai";
import GradeWords from "@/models/GradeWords";

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
    const openai = getOpenAIClient();
    const url = req.nextUrl;
    const grade = url.pathname.split("/").pop();
    await connectToDB();
    // const grade = decodeURIComponent(context.params.grade);

    console.log("📘 Grade received:", grade);

    if (!grade) {
      console.log("🚫 Grade is missing from the request.");
      return NextResponse.json(
        { success: false, error: "Grade is required in the request." },
        { status: 400 }
      );
    }

    const gradeDoc = await GradeWords.findOne({
      grade: new RegExp(`^${grade}$`, "i"),
    });

    if (!gradeDoc || gradeDoc.words.length < 1) {
      console.warn(`⚠️ No words found for grade: ${grade}`);
      return NextResponse.json(
        { success: false, error: `Grade '${grade}' not found or empty.` },
        { status: 404 }
      );
    }

    const total = gradeDoc.words.length;
    const indices = getRandomIndices(total, Math.min(5, total));
    const selectedWordObjs = indices.map((i) => gradeDoc.words[i]);
    const selectedWords = selectedWordObjs.map((w) => w.word);

    console.log("🔢 Selected words:", selectedWords);

    const prompt = `
Generate a JSON array of ${
      selectedWords.length
    } multiple-choice vocabulary quiz questions using these words: ${selectedWords.join(
      ", "
    )}. Each object must follow this exact format:

{
  "word": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "explanation": "string"
}

The questions should be simple, suitable for ${grade.replace(
      "-",
      " "
    )}, and focus on the meanings of the words.
Only return the array. Format must be strict JSON, no extra text.
`;

    console.log("🧠 Sending prompt to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
    });

    const quiz = parseOpenAIJson<
      Array<{
        word: string;
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
      }>
    >(response.choices?.[0]?.message?.content);

    const enrichedQuiz = quiz.map((q: any) => {
      const match = selectedWordObjs.find(
        (w) => w.word.toLowerCase() === q.word.toLowerCase()
      );
      return {
        ...q,
        imageURL: match?.imageURL || null,
        options: shuffleArray([...q.options]),
      };
    });

    console.log("✅ Quiz generated and enriched successfully.");
    return NextResponse.json({ success: true, data: enrichedQuiz });
  } catch (err: any) {
    console.log("❌ Grade Quiz API Error:", err.stack || err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to generate grade quiz.",
      },
      { status: 500 }
    );
  }
}
