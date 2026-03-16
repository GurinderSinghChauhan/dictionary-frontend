import React from "react";

export default function AboutPage() {
  return (
    <div
      className="max-w-5xl mx-auto px-6 py-16"
      style={{ color: "var(--primary-text-color)" }}
    >
      <h1
        className="text-5xl font-extrabold mb-10"
        style={{ color: "var(--accent-color)" }}
      >
        About Grab Vocab
      </h1>

      <p className="mb-6 text-2xl leading-relaxed font-light">
        Welcome to{" "}
        <strong style={{ color: "var(--accent-color)", fontWeight: 600 }}>
          Grab Vocab
        </strong>{" "}
        — your dedicated space to grow your vocabulary and strengthen your
        language skills. Words are powerful, and we’re here to help you master
        them.
      </p>

      <p className="mb-6 text-2xl leading-relaxed font-light">
        At Grab Vocab, we believe learning should be smart, visual, and
        enjoyable. That’s why we blend beautifully crafted word definitions,
        real-world image prompts, example sentences, memory tricks, and even
        quizzes to help you{" "}
        <em style={{ fontStyle: "italic" }}>remember and apply</em> what you
        learn.
      </p>

      <p className="mb-6 text-2xl leading-relaxed font-light">
        Whether you're preparing for competitive exams, enhancing your academic
        language, or just feeding your curiosity, Grab Vocab adapts to your
        journey. Every feature, every word, and every lesson is designed to
        empower you with clarity and confidence.
      </p>

      <p className="text-2xl leading-relaxed font-light">
        💡 Our mission is simple:{" "}
        <span style={{ color: "var(--accent-color)", fontWeight: 600 }}>
          Make vocabulary learning easy, effective, and exciting.
        </span>
        <br />
        <br />
        🚀 Explore. Practice. Master one word at a time.
        <br />
        ❤️ Made with purpose, built for learners like you.
        <br />
        <br />— Team Grab Vocab
      </p>
    </div>
  );
}