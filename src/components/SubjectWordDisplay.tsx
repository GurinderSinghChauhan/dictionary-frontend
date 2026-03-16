"use client";

import { useEffect, useState } from "react";
import { FaVolumeUp, FaBrain, FaGlobeAmericas } from "react-icons/fa";
import { BsFillBookFill, BsChatLeftQuoteFill } from "react-icons/bs";
import { MdCategory, MdOutlineSyncAlt } from "react-icons/md";
import { GiCancel, GiCardRandom } from "react-icons/gi";

interface Worddata {
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

export default function SubjectWordDetailsDisplay({
  data,
}: {
  data: Worddata;
}) {
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

  return (
    <div
      className={`max-w-7xl my-2 p-4 md:p-6 mx-auto rounded-2xl ${colorClass}`} style={{
        border: "2px solid var(--border-color)",
      }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold capitalize text-blue-500">
          {data.word}
        </h1>
        <button
          onClick={() => speak(data.word)}
          // className="text-gray-600"
          aria-label="Listen"
        >
          <FaVolumeUp size={24} />
        </button>
      </div>

      {data.pronunciation && (
        <p className="italic mt-2">/{data.pronunciation}/</p>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {data.imageURL && (
          <div className="col-span-1">
            <img
              src={data.imageURL}
              alt={data.word}
              className="w-full max-w-full h-auto rounded-xl shadow-md object-cover"
            />
          </div>
        )}

        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.meaning && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BsFillBookFill /> Meaning
              </h2>
              <p>{data.meaning}</p>
            </div>
          )}



          {/* Long + Short */}
          {data.exampleSentence && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BsChatLeftQuoteFill /> Example
              </h2>
              <p className="italic">“{data.exampleSentence}”</p>
            </div>
          )}



          {/* Long + Short */}
          {data.memoryTrick && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaBrain /> Memory Trick
              </h2>
              <p>{data.memoryTrick}</p>
            </div>
          )}

          {data.origin && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaGlobeAmericas /> Origin
              </h2>
              <p>{data.origin}</p>
            </div>
          )}
          {data.partOfSpeech && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdCategory /> Part of Speech
              </h2>
              <p>{data.partOfSpeech}</p>
            </div>
          )}
          {data.wordForms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GiCardRandom /> Word Forms
              </h2>
              <p>{data.wordForms.join(", ")}</p>
            </div>
          )}
          {data.synonyms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdOutlineSyncAlt /> Synonyms
              </h2>
              <p>{data.synonyms.join(", ")}</p>
            </div>
          )}

          {/* Remaining short ones */}
          {data.antonyms?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GiCancel /> Antonyms
              </h2>
              <p>{data.antonyms.join(", ")}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
