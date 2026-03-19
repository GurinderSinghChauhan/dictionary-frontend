"use client";
import { useState } from "react";

export default function SafariInstallBanner() {
  const [isSafari] = useState(() => {
    if (typeof navigator === "undefined") return false;

    return (
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      "standalone" in navigator &&
      !navigator.standalone
    );
  });

  if (!isSafari) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white text-black border rounded-lg shadow-md p-4 z-50">
      <p className="text-sm">
        📱 To install this app, tap the <strong>Share</strong> button and select{" "}
        <strong>&quot;Add to Home Screen&quot;</strong>.
      </p>
    </div>
  );
}
