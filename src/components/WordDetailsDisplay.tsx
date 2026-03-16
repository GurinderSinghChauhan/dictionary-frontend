"use client";

import { useEffect, useState } from "react";
import { FaVolumeHigh, FaBookOpen, FaWandMagicSparkles } from "react-icons/fa6";
import { BiSearch } from "react-icons/bi";
import {
  MdTranslate,
  MdOutlineCategory,
  MdAutorenew,
  MdLightbulbOutline,
} from "react-icons/md";
import { GiBrain } from "react-icons/gi";
import { BsStars } from "react-icons/bs";
import { RiImageEditFill } from "react-icons/ri";
import { TbLanguageKatakana } from "react-icons/tb";

interface WordResult {
  word: string;
  partOfSpeech: string;
  pronunciation: string;
  wordForms: string[];
  meaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  memoryTrick: string;
  origin: string;
  positivePrompt?: string;
  negativePrompt?: string;
  imageURL?: string;
}

const colorOptions = [
  "bg-transparent",
  // "bg-blue-100",
  // "bg-green-100",
  // "bg-yellow-100",
  // "bg-red-100",
  // "bg-purple-100",
];

export default function WordDetailsDisplay({ term }: { term: string }) {
  const [result, setResult] = useState<WordResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [colorClass, setColorClass] = useState("");

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    if (!voices.length) {
      synth.onvoiceschanged = () => speak(text);
      return;
    }

    const preferredVoices = voices.filter(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("google us") ||
          v.name.toLowerCase().includes("karen") ||
          v.name.toLowerCase().includes("zoe") ||
          v.name.toLowerCase().includes("linda") ||
          v.name.toLowerCase().includes("ava"))
    );

    const voice =
      preferredVoices[0] || voices.find((v) => v.lang.startsWith("en")) || null;
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  useEffect(() => {
    const randomColor =
      colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setColorClass(randomColor);
  }, []);

  useEffect(() => {
    if (!term) return;
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/define/${term}`);
        if (!res.ok) throw new Error("Word not found");
        const data = await res.json();
        setResult(data.result);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [term]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 md:p-16">
        <p
          className="text-lg animate-pulse flex gap-2 items-center"
          style={{ color: "var(--primary-text-color)" }}
        >
          <BiSearch /> Looking up the word...
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex justify-center p-6 md:p-16">
        <p className="text-red-500 text-2xl text-center">
          ❌ Word not found:{" "}
          <span className="font-bold text-gray-800">{term}</span>
        </p>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl my-4 p-3 md:p-4 rounded-xl mx-auto shadow-sm ${colorClass}`} style={{
      border: "1px solid var(--border-color)",
    }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold capitalize text-blue-500">{result.word}</h1>
        <button onClick={() => speak(result.word)} aria-label="Listen">
          <FaVolumeHigh
            size={24}
          // style={{ color: "var(--primary-text-color)" }}
          />
        </button>
      </div>

      {result.pronunciation && (
        <p className="italic mt-2 text-2xl">/{result.pronunciation}/</p>
      )}

      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        {/* Image */}
        {result.imageURL && (
          <div className="w-full lg:w-1/2">
            <img
              src={result.imageURL}
              alt={result.word}
              className="w-full rounded-2xl shadow-md object-cover aspect-square"
            />
          </div>
        )}

        {/* Word Info */}
        <div className="w-full lg:w-1/2 space-y-4 text-base">
          {result.meaning && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaBookOpen /> Meaning
              </h2>
              <p>{result.meaning}</p>
            </div>
          )}

          {result.partOfSpeech && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdOutlineCategory /> Part of Speech
              </h2>
              <p>{result.partOfSpeech}</p>
            </div>
          )}

          {result.wordForms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdAutorenew /> Word Forms
              </h2>
              <p>{result.wordForms.join(", ")}</p>
            </div>
          )}

          {result.exampleSentence && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BsStars /> Example
              </h2>
              <p className="italic">“{result.exampleSentence}”</p>
            </div>
          )}

          {result.synonyms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdTranslate /> Synonyms
              </h2>
              <p>{result.synonyms.join(", ")}</p>
            </div>
          )}

          {result.antonyms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TbLanguageKatakana /> Antonyms
              </h2>
              <p>{result.antonyms.join(", ")}</p>
            </div>
          )}

          {result.memoryTrick && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GiBrain /> Memory Trick
              </h2>
              <p>{result.memoryTrick}</p>
            </div>
          )}

          {result.origin && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdLightbulbOutline /> Origin
              </h2>
              <p>{result.origin}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
