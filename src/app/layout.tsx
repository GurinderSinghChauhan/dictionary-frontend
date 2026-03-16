"use client";
import Header from "@/components/Header";
import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import "@/theme/theme.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);


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
      <SessionProviderWrapper>
        <body
          className="min-h-screen w-screen overflow-x-hidden"
          style={{ background: "var(--background-gradient)" }}
        >
          {pathname === "/" && <Header />}
          <main className=" w-screen main-container">{children}</main>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}
