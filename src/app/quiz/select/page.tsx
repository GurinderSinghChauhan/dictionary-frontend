"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  GiDna1,
  GiChemicalDrop,
  GiAtom,
  GiGreekTemple,
  GiBrain,
} from "react-icons/gi";
import {
  FaGlobeAmericas,
  FaUsers,
  FaGraduationCap,
  FaBookOpen,
  FaClipboardList,
} from "react-icons/fa";
import { MdChildCare, MdAssignment } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";

const subjects = [
  { name: "English-Literature", icon: <FaBookOpen className="inline mr-2" /> },
  { name: "History", icon: <GiGreekTemple className="inline mr-2" /> },
  { name: "Geography", icon: <FaGlobeAmericas className="inline mr-2" /> },
  { name: "Biology", icon: <GiDna1 className="inline mr-2" /> },
  { name: "Chemistry", icon: <GiChemicalDrop className="inline mr-2" /> },
  { name: "Physics", icon: <GiAtom className="inline mr-2" /> },
  { name: "Political-Science", icon: <FaClipboardList className="inline mr-2" /> },
  { name: "Sociology", icon: <FaUsers className="inline mr-2" /> },
  { name: "Psychology", icon: <GiBrain className="inline mr-2" /> },
];

const grades = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
];

const exams = ["PCAT", "ACT", "SAT", "PSAT", "MCAT", "CPA", "GED", "TOEFL"];

export default function QuizSelectPage() {
  const router = useRouter();
  const [view, setView] = useState<"main" | "subject" | "grade" | "exam">("main");

  const handleSubjectClick = (sub: string) => {
    router.push(`/quiz/subject/${sub.toLowerCase()}`);
  };

  const handleGradeClick = (grade: string) => {
    router.push(`/quiz/grade/${grade.toLowerCase().replace(" ", "-")}`);
  };

  const handleExamClick = (exam: string) => {
    router.push(`/quiz/exam/${exam.toLowerCase()}`);
  };

  return (
    <div className="main-container max-w-xl mx-auto p-6">
      {view === "main" && (
        <div>
          <h1 className="text-3xl font-bold mb-8">🎯 Choose Your Quiz</h1>

          <div className="mb-6">
            <button
              onClick={() => router.push("/quiz")}
              className="w-full py-3 text-lg bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <HiOutlineRefresh /> Start Random Quiz
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setView("subject")}
              className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📚 Select Subject
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setView("grade")}
              className="w-full py-3 text-lg bg-red-600 text-white rounded-lg hover:bg-red-400"
            >
              🎓 Select Grade
            </button>
          </div>

          <div>
            <button
              onClick={() => setView("exam")}
              className="w-full py-3 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📝 Select Exam
            </button>
          </div>
        </div>
      )}

      {view === "subject" && (
        <>
          <h2 className="text-2xl font-bold mb-4">📚 Choose a Subject</h2>
          <ul className="space-y-3">
            {subjects.map((sub) => (
              <li key={sub.name}>
                <button
                  onClick={() => handleSubjectClick(sub.name)}
                  className="w-full py-3 text-left px-4 rounded-lg border transition hover:opacity-90 flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--primary-text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {sub.icon}
                  {sub.name.replace("-", " ")}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setView("main")}
            className="mt-6 underline"
            style={{ color: "var(--accent-color)" }}
          >
            ← Back
          </button>
        </>
      )}

      {view === "grade" && (
        <>
          <h2 className="text-2xl font-bold mb-4">🎓 Choose a Grade</h2>
          <ul className="space-y-3">
            {grades.map((g, idx) => (
              <li key={g}>
                <button
                  onClick={() => handleGradeClick(g)}
                  className="w-full py-3 text-left px-4 rounded-lg border transition hover:opacity-90 flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--primary-text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {idx < 5 ? (
                    <MdChildCare className="inline mr-2" />
                  ) : (
                    <FaGraduationCap className="inline mr-2" />
                  )}
                  {g}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setView("main")}
            className="mt-6 underline"
            style={{ color: "var(--accent-color)" }}
          >
            ← Back
          </button>
        </>
      )}

      {view === "exam" && (
        <>
          <h2 className="text-2xl font-bold mb-4">📝 Choose an Exam</h2>
          <ul className="space-y-3">
            {exams.map((g) => (
              <li key={g}>
                <button
                  onClick={() => handleExamClick(g)}
                  className="w-full py-3 text-left px-4 rounded-lg border transition hover:opacity-90 flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--primary-text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <MdAssignment className="inline mr-2" />
                  {g}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setView("main")}
            className="mt-6 underline"
            style={{ color: "var(--accent-color)" }}
          >
            ← Back
          </button>
        </>
      )}
    </div>
  );
}