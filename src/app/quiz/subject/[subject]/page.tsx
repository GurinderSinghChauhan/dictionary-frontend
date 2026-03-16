"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaBrain,
  FaTrophy,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { MdCancel, MdCheckCircle, MdImage } from "react-icons/md";

type QuizQuestion = {
  word: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageURL?: string;
};

export default function SubjectQuizPage() {
  const { subject } = useParams();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasFetched = useRef(false);

  const current = quiz[step];

  useEffect(() => {
    if (!subject || hasFetched.current) return;
    hasFetched.current = true;
    fetchQuiz();
  }, [subject]);

  // Reset image loading state when step changes and there's an image
  useEffect(() => {
    if (current?.imageURL) {
      setIsImageLoading(true);
      setImageError(false);
    }
  }, [step, current?.imageURL]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/subject/${subject}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setQuiz(data.data);
      } else {
        alert("Failed to load quiz.");
      }
    } catch (err) {
      console.log("❌ Failed to fetch quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedAnswers((prev) => [...prev, option]);
    setSelected(option);
    if (option === current.correctAnswer) setScore((s) => s + 1);
    setTimeout(() => {
      if (step + 1 < quiz.length) {
        setStep((s) => s + 1);
        setSelected(null);
        setIsImageLoading(true); // Reset image loading state for next question
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setStep(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setSelectedAnswers([]);
    setIsImageLoading(true); // Reset image loading state
    setImageError(false);
  };

  const nextQuiz = () => {
    hasFetched.current = false;
    resetQuiz();
    fetchQuiz();
  };

  if (loading) return <p className="p-6 text-gray-700">Loading quiz...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize flex items-center gap-2 text-[var(--accent-color)]">
        <FaBrain /> Subject Quiz: {subject?.toString().replace("-", " ")}
      </h1>

      {showResult ? (
        <div className="text-center">
          <h2 className="text-2xl mb-4 flex justify-center items-center gap-2 text-[var(--accent-color)]">
            <FaTrophy /> You scored {score} / {quiz.length}
          </h2>

          <div className="mt-6 space-y-6 text-left">
            {quiz.map((q, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border shadow-sm space-y-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--primary-text-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <p className="font-medium text-[var(--accent-color)]">
                  Q{i + 1}: {q.question}
                </p>

                {q.imageURL && (
                  <img
                    src={q.imageURL}
                    alt={q.word}
                    className="w-full object-cover rounded-md"
                  />
                )}

                <ul className="pl-4 space-y-1">
                  {q.options.map((opt) => (
                    <li
                      key={opt}
                      className={`pl-2 flex items-center gap-2 ${
                        opt === q.correctAnswer
                          ? "text-green-700 font-semibold"
                          : opt === selectedAnswers[i]
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {opt === q.correctAnswer ? (
                        <MdCheckCircle />
                      ) : opt === selectedAnswers[i] ? (
                        <MdCancel />
                      ) : (
                        <MdImage className="opacity-0" />
                      )}
                      {opt}
                    </li>
                  ))}
                </ul>

                <p className="text-sm">
                  ✅ Correct Answer: <strong>{q.correctAnswer}</strong>
                </p>
                <p className="text-sm italic text-gray-600 flex items-center gap-2">
                  <FaLightbulb /> {q.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-x-4">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "white",
              }}
            >
              <BiRefresh /> Retry Same Quiz
            </button>
            <button
              onClick={nextQuiz}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "white",
              }}
            >
              <FaArrowRight /> Next Quiz
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-6 rounded-xl shadow-md space-y-4"
          style={{
            backgroundColor: "var(--card-bg)",
            color: "var(--primary-text-color)",
            borderColor: "var(--border-color)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h2 className="text-xl font-semibold">
            Q{step + 1}: {current.question}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {current.imageURL && (
              <div className="md:w-1/2 min-h-full w-full relative">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10 rounded-md">
                    <span className="text-gray-500 animate-pulse">
                      Loading image...
                    </span>
                  </div>
                )}
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10 rounded-md">
                    <span className="text-gray-500 text-center">
                      Image failed to load
                    </span>
                  </div>
                )}
                <img
                  src={current.imageURL}
                  alt={current.word}
                  onLoad={() => {
                    setIsImageLoading(false);
                    setImageError(false);
                  }}
                  onError={() => {
                    setIsImageLoading(false);
                    setImageError(true);
                    console.error('Failed to load image:', current.imageURL);
                  }}
                  className="w-full h-64 object-cover rounded-md"
                  style={{ display: isImageLoading || imageError ? 'none' : 'block' }}
                />
              </div>
            )}
            <div className="flex-1 space-y-3">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition duration-200
                ${
                  selected
                    ? opt === current.correctAnswer
                      ? "bg-green-100 border-green-600 text-green-800"
                      : opt === selected
                      ? "bg-red-100 border-red-600 text-red-800"
                      : ""
                    : " hover:bg-indigo-100"
                }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <p className="mt-4 italic text-sm text-gray-600 flex items-center gap-2">
              <FaLightbulb /> {current.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}