"use client";

import { useEffect, useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import SubjectWordDetailsDisplay from "./SubjectWordDisplay";
import axios from "axios";

interface WordResult {
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
  imageURL?: string;
}

interface SubjectWordsListProps {
  subject: string;
}

export default function SubjectWordsList({ subject }: SubjectWordsListProps) {
  const [words, setWords] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/subject/${subject}`, {
          params: { page, limit },
        });
        setWords(res.data.words || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err: any) {
        if (err.response?.status === 404) {
          console.warn("⚠️ Subject not found:", subject);
          setWords([]);
          setTotalPages(1);
        } else {
          console.log("❌ Error fetching subject words:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchWords();
  }, [subject, page, limit]);

  if (loading) return <div className="p-4">Loading words...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col overflow-y-auto snap-y snap-mandatory space-y-6 max-h-[90vh] scrollbar-hide">
        {words.length > 0 ? (
          words.map((word) => (
            <div key={word.word} className="snap-start">
              <SubjectWordDetailsDisplay key={word.word} data={word} />
            </div>
          ))
        ) : (
          <p className="text-center text-red-500 mt-4">
            No words found for this subject.
          </p>
        )}
      </div>
      {words.length > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      )}
    </div>
  );
}
