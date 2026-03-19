import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Word from "@/models/Word";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    // Extract "word" param from URL
    const pathname = req.nextUrl.pathname; // e.g., /api/define/limerence
    const term = pathname.split("/").pop()?.toLowerCase();

    if (!term) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const existing = await Word.findOne({
      word: new RegExp(`^${term}$`, "i"),
    });

    if (existing) {
      return NextResponse.json({ term, result: existing });
    }

    return NextResponse.json(
      { error: `Word '${term}' not found in dictionary.` },
      { status: 404 }
    );
  } catch (err) {
    console.log("❌ Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
