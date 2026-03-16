"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import PaginationControls from "@/components/PaginationControls";
import SubjectWordDetailsDisplay from "@/components/SubjectWordDisplay";

interface Word {
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
  positivePrompt?: string;
  negativePrompt?: string;
  imageURL?: string;
}

const colorOptions = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-purple-100",
];

const DictionaryWords = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/dictionary`, {
        params: { page, limit: limit, search: "" },
      });
      setWords(res.data.wordsArray || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch words:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWords();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">📚 Dictionary Words (A-Z)</h1>

      {loading ? (
        <p>Loading...</p>
      ) : words.length === 0 ? (
        <p>No words found.</p>
      ) : (
        <div className="flex flex-col overflow-y-auto snap-y snap-mandatory space-y-6 max-h-[90vh] scrollbar-hide">
          {words.map((w, index) => (
            <div key={index} className="snap-start">
              <SubjectWordDetailsDisplay data={w} />
            </div>
          ))}
        </div>
      )}

      {words.length > 0 && (
        <PaginationControls
          limit={limit}
          page={page}
          setLimit={setLimit}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default DictionaryWords;
