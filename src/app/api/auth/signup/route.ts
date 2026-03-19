// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    console.log("📩 Received signup request");

    const { username, email, password } = await request.json();
    console.log("✅ Parsed body:", { username, email });

    await connectToDB();
    console.log("🔌 Connected to MongoDB");

    if (!username || !email || !password) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      console.warn("🚫 User already exists:", {
        username: existingUser.username,
        email: existingUser.email,
      });
      return NextResponse.json(
        { error: "Username or email already taken." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔒 Password hashed");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ New user created:", { id: newUser._id, username });

    return NextResponse.json(
      {
        success: true,
        message: "Signup successful!",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("❌ Signup error:", error.stack || error);
    return NextResponse.json(
      {
        error: "Something went wrong during signup.",
        data: { message: error.message, name: error.name },
      },
      { status: 500 }
    );
  }
}
