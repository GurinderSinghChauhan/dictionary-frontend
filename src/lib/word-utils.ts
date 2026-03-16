import { WordDetails } from "@/types/word";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function getWordDetails(word: string): Promise<WordDetails> {
  const prompt = `
    Provide a detailed dictionary-style breakdown of the word: "${word}". 
    Format your response as a valid JSON object with the following keys exactly:

    {
        "word": string,
        "partOfSpeech": string,
        "pronunciation": string,
        "wordForms": string[],
        "meaning": string,
        "exampleSentence": string,
        "synonyms": string[],
        "antonyms": string[],
        "memoryTrick": string,
        "origin": string,
        "positivePrompt": string,
        "negativePrompt": string
    }
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const data: WordDetails = JSON.parse(response.choices[0].message.content!);
    return data;
  } catch (err) {
    console.log("Failed to parse:", err);
    return {
      word,
      partOfSpeech: "",
      pronunciation: "",
      wordForms: [],
      meaning: "",
      exampleSentence: "",
      synonyms: [],
      antonyms: [],
      memoryTrick: "",
      origin: "",
      positivePrompt: "",
      negativePrompt: "",
    };
  }
}