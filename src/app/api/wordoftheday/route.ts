import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Word from "@/models/Word";
import WordOfDay from "@/models/WordOfDay";

export async function GET() {
  try {
    await connectToDB();

    const today = new Date().toISOString().split("T")[0];

    const existing = await WordOfDay.findOne({ date: today });
    if (existing) {
      return NextResponse.json(existing);
    }

    const [wordData] = await Word.aggregate([{ $sample: { size: 1 } }]);

    if (!wordData?.word || !wordData?.meaning) {
      return NextResponse.json(
        { error: "No words available for word of the day" },
        { status: 404 }
      );
    }

    const saved = await WordOfDay.create({
      word: wordData.word,
      meaning: wordData.meaning,
      date: today,
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.log("Error:", err);
    return NextResponse.json({ error: "Failed to get word of the day" }, { status: 500 });
  }
}
