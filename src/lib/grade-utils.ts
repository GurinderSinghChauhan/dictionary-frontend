// lib/actions/getGradeWords.ts

import GradeWords from "@/models/GradeWords";

export const getGradeWords = async (
  grade: string,
  page: number,
  limit: number
) => {
  if (!grade) throw new Error("Grade is required.");

  const result = await GradeWords.findOne({
    grade: new RegExp(`^${grade}$`, "i"),
  });

  if (!result) throw new Error("Grade not found.");

  const startIndex = (page - 1) * limit;
  const paginatedWords = result.words.slice(startIndex, startIndex + limit);

  return {
    grade: result.grade,
    totalWords: result.words.length,
    page,
    totalPages: Math.ceil(result.words.length / limit),
    words: paginatedWords,
  };
};