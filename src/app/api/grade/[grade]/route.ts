// app/api/grade/[grade]/route.ts

import { connectToDB } from "@/lib/mongodb";
import { getGradeWords } from "@/lib/grade-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const url = req.nextUrl;
    const grade = url.pathname.split("/").pop(); // Extract the grade from the path
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!grade) {
      return NextResponse.json({ success: false, error: "Gradet is required." }, { status: 400 });
    }

    const data = await getGradeWords(grade, page, limit);

    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (err: any) {
    console.log("❌ API error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: err.message.includes("not found") ? 404 : 500 }
    );
  }
}