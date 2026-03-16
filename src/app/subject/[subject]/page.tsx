"use client";

import SubjectWordsList from "@/components/SubjectWordList";
import { useParams } from "next/navigation";

export default function SubjectPage() {
  const params = useParams();
  const subject = params.subject as string;
  const parts = subject.split("-");
  const formattedSubject = parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <div
      className="p-0 max-w-6xl mx-auto rounded-xl shadow-sm"
      style={{
        backgroundColor: "var(--background-color)",
        color: "var(--primary-text-color)",
      }}
    >
      <h1
        className="text-2xl font-bold mb-6 capitalize"
        // style={{ color: "var(--accent-color)" }}
      >
        Words for: {formattedSubject}
      </h1>
      {subject ? (
        <SubjectWordsList subject={subject} />
      ) : (
        <p style={{ color: "var(--secondary-text-color)" }}>
          No subject selected.
        </p>
      )}
    </div>
  );
}