"use client";
import { useEffect, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

type WordData = {
  word: string;
  meaning: string;
  date: string;
};

const colorOptions = [
  // "bg-accent/10", // Using Tailwind's custom theme color with transparency
  "bg-green-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-purple-100",
];

export default function WordOfTheDay() {
  const router = useRouter();
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [colorClass, setColorClass] = useState("");

  useEffect(() => {
    const randomColor =
      colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setColorClass(randomColor);
    fetchWordOfTheDay();
  }, []);

  const speak = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (voice) =>
        voice.lang === "en-US" &&
        (voice.name.includes("Female") ||
          voice.name.includes("Google") ||
          voice.name.includes("Samantha"))
    );
    if (femaleVoice) msg.voice = femaleVoice;
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };

  const formatDateString = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const fetchWordOfTheDay = async () => {
    try {
      const response = await axios.get("/api/wordoftheday");
      setWordData(response.data);
    } catch (error) {
      console.log("Error fetching word of the day:", error);
      setWordData(null);
    }
  };

  if (!wordData) return <p className="p-4 text-secondaryText">Loading...</p>;

  return (
    <section className="flex flex-col md:flex-row justify-center items-stretch text-primaryText gap-6">
      <div
        className={`flex-1 min-h-[350px] rounded-2xl shadow-lg p-8 flex flex-col justify-center ${colorClass} text-black`}
        style={{
          border: `2px solid var(--border-color)`,
          // backgroundColor: `var(--background-color)`,
          // color: `var(--primary-text-color)`,
        }}
      >
        <h2 className="text-xl font-semibold text-accent">
          Word of the Day
        </h2>
        <p className="text-secondaryText">{formatDateString(wordData.date)}</p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="mt-3 text-3xl font-bold text-primaryText mb-2">
            {wordData.word}
          </h1>
          <button
            onClick={() => speak(wordData.word)}
            className="mb-4 p-2 bg-transparent rounded-lg"
            aria-label="Listen"
          >
            <FaVolumeUp size={24} />
          </button>
        </div>

        <p className="mt-2 text-2xl italic text-secondaryText">
          {wordData.meaning}
        </p>

        <button
          onClick={() => router.push(`/word/${wordData.word}`)}
          className="mt-6 py-2 px-4 border border-accent hover:text-white hover:bg-linkHover rounded-lg transition duration-200 text-sm self-start"
        >
          See Full Definition
        </button>
      </div>
    </section>
  );
}
