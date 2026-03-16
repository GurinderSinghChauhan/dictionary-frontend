// src/app/api/quiz/subject/[subject]/route.ts
import { connectToDB } from "@/lib/mongodb";
import SubjectWords from "@/models/SubjectWords";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const url = req.nextUrl;
    const subject = url.pathname.split("/").pop();
    const subjectEntry = await SubjectWords.findOne({
      subject: new RegExp(`^${subject}$`, "i"),
    });

    if (
      !subjectEntry ||
      !Array.isArray(subjectEntry.words) ||
      subjectEntry.words.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Subject not found or has no words." },
        { status: 404 }
      );
    }

    // Select 5 random words
    const sample = (subjectEntry.words as { word: string; imageURL?: string }[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const prompt = `Generate a JSON array of 5 multiple-choice vocabulary quiz questions using these words: ${sample
      .map((w) => w.word)
      .join(", ")}. Each object must follow this exact format:

    {
      "word": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }

Make sure questions are simple and contextually useful. Only return the array, nothing else.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
    });

    function shuffleArray(array: string[]) {
      return array.sort(() => Math.random() - 0.5);
    }

    const content = response.choices[0].message.content || "[]";

    const rawQuestions = JSON.parse(content);

    // Attach imageURL from original word list
    const questionsWithImages = rawQuestions.map((q: any) => {
      const options = shuffleArray([...q.options]);
      const match = sample.find(
        (w) => w.word.toLowerCase() === q.word.toLowerCase()
      );
      return {
        ...q,
        imageURL: match?.imageURL || null,
        options,
      };
    });

    return NextResponse.json({ success: true, data: questionsWithImages });
  } catch (err: any) {
    console.log("❌ Subject Quiz API Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to generate subject quiz." },
      { status: 500 }
    );
  }
}
