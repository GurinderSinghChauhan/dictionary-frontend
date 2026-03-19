export type QuizSourceWord = {
  word: string;
  meaning?: string;
  imageURL?: string;
};

type QuizQuestion = {
  word: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageURL?: string | null;
};

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function normalizeMeaning(meaning?: string) {
  return meaning?.trim() || "";
}

function buildDistractors(words: QuizSourceWord[], currentWord: string, currentMeaning: string) {
  const distractors = words
    .filter((item) => item.word !== currentWord)
    .map((item) => normalizeMeaning(item.meaning))
    .filter((meaning) => meaning && meaning !== currentMeaning);

  return shuffleArray(Array.from(new Set(distractors))).slice(0, 3);
}

export function buildQuizFromWords(words: QuizSourceWord[]): QuizQuestion[] {
  const usableWords = words.filter((item) => normalizeMeaning(item.meaning));

  return usableWords.slice(0, 5).map((item, index) => {
    const correctAnswer = normalizeMeaning(item.meaning);
    const distractors = buildDistractors(usableWords, item.word, correctAnswer);

    const fallbackOptions = [
      "A type of action or event",
      "A person or place name",
      "A number or measurement",
    ];

    const options = shuffleArray([
      correctAnswer,
      ...distractors,
      ...fallbackOptions.filter((option) => option !== correctAnswer && !distractors.includes(option)),
    ]).slice(0, 4);

    return {
      word: item.word,
      question: `What is the best meaning of "${item.word}"?`,
      options,
      correctAnswer,
      explanation: `${item.word} means ${correctAnswer}.`,
      imageURL: item.imageURL || null,
    };
  });
}

export function pickRandomWords<T>(words: T[], count: number) {
  return shuffleArray(words).slice(0, Math.min(count, words.length));
}
