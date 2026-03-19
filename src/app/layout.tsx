"use client";
import Header from "@/components/Header";
import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import "@/theme/theme.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme] = useState(() =>
    typeof window === "undefined" ? "light" : localStorage.getItem("theme") || "light"
  );
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <html lang="en" data-theme={theme}>
      <head>
        {/* iOS PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className="min-h-screen w-screen overflow-x-hidden"
        style={{ background: "var(--background-gradient)" }}
      >
        <SessionProviderWrapper>
          {pathname === "/" && <Header />}
          <main className=" w-screen main-container">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
