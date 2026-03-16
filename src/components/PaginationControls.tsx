"use client";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Props {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
}

export default function PaginationControls({
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
}: Props) {
  const handlePrev = () => setPage(Math.max(page - 1, 1));
  const handleNext = () => setPage(Math.min(page + 1, totalPages));
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div
      className="flex flex-row md:items-center justify-between mb-4 gap-4 p-4 rounded-xl shadow-sm border"
      style={{
        backgroundColor: "var(--card-bg)",
        color: "var(--primary-text-color)",
        borderColor: "var(--border-color)",
      }}
    >
      <div>
        {/* <label className="mr-2 font-medium">Words per page:</label> */}
        <select
          value={limit}
          onChange={handleLimitChange}
          className="border px-2 py-1 rounded"
          style={{
            backgroundColor: "var(--background-color)",
            color: "var(--primary-text-color)",
            borderColor: "var(--border-color)",
          }}
        >
          {[5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="flex items-center gap-2 px-3 py-1 rounded"
          style={{
            color: "var(--primary-text-color)",
            opacity: page === 1 ? 0.5 : 1,
            cursor: page === 1 ? "not-allowed" : "pointer",
            background: "transparent",
            border: "none",
          }}
        >
          <FaArrowLeft />
        </button>

        <span className="text-lg font-semibold">
          {page} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="flex items-center gap-2 px-3 py-1 rounded"
          style={{
            color: "var(--primary-text-color)",
            opacity: page === totalPages ? 0.5 : 1,
            cursor: page === totalPages ? "not-allowed" : "pointer",
            background: "transparent",
            border: "none",
          }}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
