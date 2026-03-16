// lib/actions/getExamWords.ts

import ExamWords from "@/models/ExamWords";

export const getExamWords = async (
  exam: string,
  page: number,
  limit: number
) => {
  if (!exam) throw new Error("Exam is required.");

  const result = await ExamWords.findOne({
    exam: new RegExp(`^${exam}$`, "i"),
  });

  if (!result) throw new Error("Exam not found.");

  const startIndex = (page - 1) * limit;
  const paginatedWords = result.words.slice(startIndex, startIndex + limit);

  return {
    exam: result.exam,
    totalWords: result.words.length,
    page,
    totalPages: Math.ceil(result.words.length / limit),
    words: paginatedWords,
  };
};