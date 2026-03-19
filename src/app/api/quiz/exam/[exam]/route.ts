import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { buildQuizFromWords } from "@/lib/quiz-utils";
import ExamWords from "@/models/ExamWords";

function getRandomIndices(length: number, count: number) {
  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * length));
  }
  return Array.from(indices);
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
    const enriched = buildQuizFromWords(selectedWordObjs);

    return NextResponse.json({ success: true, data: enriched });
  } catch (err: any) {
    console.log("❌ Exam Quiz API Error:", err.stack || err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate quiz." },
      { status: 500 }
    );
  }
}
