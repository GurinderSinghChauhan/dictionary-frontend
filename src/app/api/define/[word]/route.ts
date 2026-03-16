import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Word from "@/models/Word";
import { getWordDetails } from "@/lib/word-utils";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    // Extract "word" param from URL
    const pathname = req.nextUrl.pathname; // e.g., /api/define/limerence
    const term = pathname.split("/").pop()?.toLowerCase();

    if (!term) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const existing = await Word.findOne({ word: term });

    if (existing) {
      return NextResponse.json({ term, result: existing });
    }

    const wordData = await getWordDetails(term);
    const savedWord = await Word.create(wordData);

    return NextResponse.json({ term, result: savedWord });
  } catch (err) {
    console.log("❌ Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
