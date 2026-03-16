import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import WordOfDay from "@/models/WordOfDay";
import { getRandomWordFromOpenAI } from "@/lib/openai";
import { getWordDetails } from "@/lib/word-utils";

export async function GET() {
  try {
    await connectToDB();

    const today = new Date().toISOString().split("T")[0];

    const existing = await WordOfDay.findOne({ date: today });
    if (existing) {
      return NextResponse.json(existing);
    }

    const word = await getRandomWordFromOpenAI();
    const wordData = await getWordDetails(word);

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