import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, type } = await req.json();

    if (!email || !password || (type === "signup" && !fullName)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 👉 Dummy logic (replace with database/auth logic)
    if (type === "signup") {
      console.log("📦 Creating user:", { email, fullName });
      return NextResponse.json({
        success: true,
        message: "Signup successful!",
      });
    } else if (type === "login") {
      console.log("🔐 Logging in user:", { email });
      return NextResponse.json({ success: true, message: "Login successful!" });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid type provided." },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.log("❌ Auth error:", err);
    return NextResponse.json(
      { success: false, error: "Server error during auth." },
      { status: 500 }
    );
  }
}
