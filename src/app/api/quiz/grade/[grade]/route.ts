import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { buildQuizFromWords } from "@/lib/quiz-utils";
import GradeWords from "@/models/GradeWords";

function getRandomIndices(length: number, count: number) {
  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * length));
  }
  return Array.from(indices);
}

export async function GET(req: NextRequest) {
  try {
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

    const enrichedQuiz = buildQuizFromWords(selectedWordObjs);

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
