import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { buildQuizFromWords } from "@/lib/quiz-utils";
import Word from "@/models/Word";

export async function GET() {
  try {
    await connectToDB();

    // Step 1: Get total count of words in the DB
    const totalCount = await Word.countDocuments();
    if (totalCount < 5) {
      return NextResponse.json({
        success: false,
        error: "Not enough words in the database.",
      });
    }

    // Step 2: Sample 5 random words
    const randomWords = await Word.aggregate([{ $sample: { size: 5 } }]);

    const quiz = buildQuizFromWords(randomWords);

    return NextResponse.json({ success: true, data: quiz });
  } catch (err: any) {
    console.log("❌ Quiz API Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to generate quiz." },
      { status: 500 }
    );
  }
}
