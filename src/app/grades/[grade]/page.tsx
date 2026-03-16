'use client';
import GradeWordsList from "@/components/GradeWordList";
import { useParams } from "next/navigation";

export default function GradePage() {
  const params = useParams();
  const grade = params.grade as string;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Words for: <span className="text-blue-500">{grade}</span>
      </h1>
      {grade ? (
        <GradeWordsList Grade={grade} />
      ) : (
        <p>No grade selected.</p>
      )}
    </div>
  );
}