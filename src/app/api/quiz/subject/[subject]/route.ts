// src/app/api/quiz/subject/[subject]/route.ts
import { connectToDB } from "@/lib/mongodb";
import { buildQuizFromWords, pickRandomWords, type QuizSourceWord } from "@/lib/quiz-utils";
import SubjectWords from "@/models/SubjectWords";
import { NextRequest, NextResponse } from "next/server";

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

    const sample = pickRandomWords(subjectEntry.words as QuizSourceWord[], 5);
    const questionsWithImages = buildQuizFromWords(sample);

    return NextResponse.json({ success: true, data: questionsWithImages });
  } catch (err: any) {
    console.log("❌ Subject Quiz API Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to generate subject quiz." },
      { status: 500 }
    );
  }
}
