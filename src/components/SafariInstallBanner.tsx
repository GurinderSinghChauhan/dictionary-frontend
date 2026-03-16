"use client";
import { useEffect, useState } from "react";

export default function SafariInstallBanner() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const isSafariBrowser =
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      "standalone" in navigator &&
      !navigator.standalone;

    setIsSafari(isSafariBrowser);
  }, []);

  if (!isSafari) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white text-black border rounded-lg shadow-md p-4 z-50">
      <p className="text-sm">
        📱 To install this app, tap the <strong>Share</strong> button and select{" "}
        <strong>"Add to Home Screen"</strong>.
      </p>
    </div>
  );
}