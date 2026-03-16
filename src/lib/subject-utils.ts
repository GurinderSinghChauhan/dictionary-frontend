// lib/actions/getSubjectWords.ts

import SubjectWords from "@/models/SubjectWords";

export const getSubjectWords = async (
  subject: string,
  page: number,
  limit: number
) => {
  if (!subject) throw new Error("Subject is required.");

  const result = await SubjectWords.findOne({
    subject: new RegExp(`^${subject}$`, "i"),
  });

  if (!result) throw new Error("Subject not found.");

  const startIndex = (page - 1) * limit;
  const paginatedWords = result.words.slice(startIndex, startIndex + limit);

  return {
    subject: result.subject,
    totalWords: result.words.length,
    page,
    totalPages: Math.ceil(result.words.length / limit),
    words: paginatedWords,
  };
};