import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Make sure you have a User schema
import { connectToDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 401 }
      );
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const isMatch = await bcrypt.compare(hashedPassword, user.password);
    const isMatch = password === user.password;

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.log("❌ Login error:", err);
    return NextResponse.json(
      { success: false, error: "Server error during login.", data: err },
      { status: 500 }
    );
  }
}
