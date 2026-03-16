"use client";
import ExamWordsList from "@/components/ExamWordsList";
import { useParams } from "next/navigation";

export default function ExamPage() {
  const params = useParams();
  const exam = params.exam as string;
  const parts = exam.split("-");
  const formattedExam = parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Words for:{" "}
        <span className="text-blue-500">
          {formattedExam.toUpperCase()}
        </span>
      </h1>
      {exam ? <ExamWordsList exam={exam} /> : <p>No exam selected.</p>}
    </div>
  );
}
