"use client";

import { useEffect, useRef, useState } from "react";
import { FaBrain, FaLightbulb, FaQuestionCircle } from "react-icons/fa";

export default function QuickQuizPage() {
  const hasFetched = useRef(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const current = quiz[step];

  useEffect(() => {
    if (!hasFetched.current) {
      fetchQuiz();
      hasFetched.current = true;
    }
  }, []);

  // useEffect(() => {
  //   if (current.imageURL) {
  //     const img = new Image();
  //     img.src = current.imageURL;
  //     img.onload = () => setImageLoaded(true);
  //   }
  // }, [current.imageURL]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setQuiz(data.data);
      } else {
        setQuiz([]);
      }
    } catch (err) {
      console.log("Error fetching quiz:", err);
      setQuiz([]);
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
        setStep(step + 1);
        setSelected(null);
        setImageLoaded(false); // ⬅ Reset here
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
    fetchQuiz();
  };

  const nextQuiz = () => {
    resetQuiz();
    setLoading(true);
    fetchQuiz();
  };

  if (loading) return <p className="p-6">Loading quiz...</p>;

  return (
    <div
      className="max-w-2xl mx-auto p-6 rounded-xl"
      style={{ color: "var(--primary-text-color)" }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaBrain /> Quick Quiz
      </h1>

      {showResult ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            ✅ You scored {score} / {quiz.length}
          </h2>

          <div className="space-y-6">
            {quiz.map((q, index) => (
              <div
                key={q.word}
                className="p-4 rounded-lg shadow-md border"
                style={{
                  backgroundColor: "var(--background-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                {q.imageURL && (
                  <div className="w-full md:w-1/2 flex justify-center items-center relative">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-lg z-10">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <img
                      src={q.imageURL}
                      alt={q.word}
                      onLoad={() => setImageLoaded(true)}
                      className={`w-full aspect-square object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    />
                  </div>
                )}
                <p className="font-medium text-indigo-700 mb-2">
                  Q{index + 1}: {q.question}
                </p>

                <ul className="list-disc pl-6 mb-2">
                  {q.options.map((opt: string) => (
                    <li
                      key={opt}
                      className={`${opt === q.correctAnswer
                        ? "text-green-700 font-semibold"
                        : opt === selectedAnswers[index]
                          ? "text-red-600"
                          : "var(--primary-text-color)"
                        }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-700">
                  ✅ Correct:{" "}
                  <span className="font-medium">{q.correctAnswer}</span>
                </p>

                <p className="text-sm italic text-gray-500 mt-1">
                  💡 {q.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-x-4">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 rounded-lg"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "white",
              }}
            >
              Retry Same Quiz
            </button>
            <button
              onClick={nextQuiz}
              className="px-4 py-2 rounded-lg"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "white",
              }}
            >
              Next Quiz
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border rounded-xl shadow-md p-4 md:p-6 mb-6"
          style={{
            backgroundColor: "var(--background-color)",
            borderColor: "var(--border-color)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaQuestionCircle /> Q{step + 1}: {current.question}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            {current.imageURL && (
              <div className="w-full md:w-1/2 flex justify-center items-center relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-lg z-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={current.imageURL}
                  alt={current.word}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full aspect-square object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
              </div>
            )}

            {/* Options */}
            <div className="flex-1 space-y-3">
              {current.options.map((opt: any) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className="w-full text-left px-4 py-3 rounded-lg border transition duration-200"
                  style={{
                    backgroundColor:
                      selected && opt === current.correctAnswer
                        ? "var(--green-bg)"
                        : selected && opt === selected
                          ? "var(--red-bg)"
                          : "var(--background-color)",
                    borderColor:
                      selected && opt === current.correctAnswer
                        ? "green"
                        : selected && opt === selected
                          ? "red"
                          : "var(--border-color)",
                    color:
                      selected && opt === current.correctAnswer
                        ? "green"
                        : selected && opt === selected
                          ? "red"
                          : "var(--primary-text-color)",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {selected && (
            <p className="mt-4 italic text-sm text-gray-600 flex items-center gap-2">
              <FaLightbulb /> Explanation: {current.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
