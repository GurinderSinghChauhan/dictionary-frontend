import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connectToDB } from "@/lib/mongodb";
import Word from "@/models/Word";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Step 3: Prepare words for prompt
    const wordList = randomWords.map((w) => w.word).join(", ");

    // Step 4: Send prompt to OpenAI
    const prompt = `
Generate 5 beginner-friendly multiple choice vocabulary questions for the following words: ${wordList}

Each object must follow this exact JSON format:
{
  "word": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "explanation": "string"
}

Rules:
- Use simple definitions suitable for learners in grades 6–10.
- Avoid technical, rare, or confusing words.
- Make each option believable.
- Explanations must be clear and brief.
- Return ONLY a valid JSON array of 5 items.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
    });

    function shuffleArray(array: string[]) {
      return array.sort(() => Math.random() - 0.5);
    }

    const content = response.choices[0].message.content || "";
    const quizData = JSON.parse(content);

    // Step 5: Merge imageURL from DB into quiz questions
    const enrichedQuiz = quizData.map((q: any) => {
      const match = randomWords.find(
        (w) => w.word.toLowerCase() === q.word.toLowerCase()
      );
      return {
        ...q,
        imageURL: match?.imageURL || null,
        options: shuffleArray([...q.options]),
      };
    });

    return NextResponse.json({ success: true, data: enrichedQuiz });
  } catch (err: any) {
    console.log("❌ Quiz API Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to generate quiz." },
      { status: 500 }
    );
  }
}
