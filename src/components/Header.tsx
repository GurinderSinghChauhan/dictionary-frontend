"use client";
import { JSX, useEffect, useRef, useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import grabvocab from "../../public/image.png";
import didYouMean from "didyoumean";
import words from "an-array-of-english-words";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { buttonColorMap, navItems } from "@/data";
import { FaShareAlt, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { MdQuiz, MdGrade } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiBookAlt } from "react-icons/bi";
import { BsBookHalf } from "react-icons/bs";
import { GiBookmarklet } from "react-icons/gi";
import { FaMoon, FaSun } from "react-icons/fa";
import "@/theme/theme.css"; // or .scss/.module.css

const dictionaryWords = words;

const iconMap: { [key: string]: JSX.Element } = {
  "Social Media": <FaShareAlt className="inline mr-2" />,
  "Login / Signup": <FaUserCircle className="inline mr-2" />,
  Logout: <FiLogOut className="inline mr-2" />,
  "About Us": <AiOutlineInfoCircle className="inline mr-2" />,
  "Dictionary A-Z": <BiBookAlt className="inline mr-2" />,
  Quiz: <MdQuiz className="inline mr-2" />,
  Grades: <MdGrade className="inline mr-2" />,
  Exam: <GiBookmarklet className="inline mr-2" />,
  Subject: <BsBookHalf className="inline mr-2" />,
};

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Debug: Log the current mobile state
  console.log('Current isMobile state:', isMobile);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: session } = useSession();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 640; // Using Tailwind's sm breakpoint
      console.log('Window width:', window.innerWidth, 'Is mobile:', isMobileView);
      setIsMobile(isMobileView);
    };

    // Check immediately
    checkMobile();

    // Also check on resize
    window.addEventListener('resize', checkMobile);

    // Set initial state based on screen size
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleUserUpdate = (e: any) => {
      const updatedUser = e.detail;
      setUser(updatedUser);
      setIsLoggedIn(true);
    };

    window.addEventListener("user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser);
        setUser(parsedUser as any);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user:", err);
        setUser(undefined);
        setIsLoggedIn(false);
      }
    } else if (session?.user) {
      setUser(session.user as any);
      setIsLoggedIn(true);
    } else {
      setUser(undefined);
      setIsLoggedIn(false);
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const corrected = didYouMean(trimmedQuery, dictionaryWords);
    if (corrected && corrected !== trimmedQuery) {
      if (confirm(`Did you mean '${corrected}'?`)) {
        setQuery("");
        setSuggestions([]);
        router.push(`/word/${corrected}`);
        return;
      }
    }
    setQuery("");
    setSuggestions([]);
    router.push(`/word/${trimmedQuery}`);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://api.datamuse.com/sug?s=${query}`);
        const data = await res.json();
        setSuggestions(data.slice(0, 5).map((item: any) => item.word));
      } catch (err) {
        console.log("Error fetching suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [query]);

  const handleSelectSubject = (value: string, type: "subject" | "grades") => {
    router.push(`/${type}/${value}`);
    setDrawerOpen(false);
  };

  const handleBlur = () => {
    // Delay clearing suggestions to allow `onMouseDown` to process
    setTimeout(() => setSuggestions([]), 100);
  };

  const topButtons = [
    "Social Media",
    "About Us",
    isLoggedIn ? "Logout" : "Login / Signup",
  ];

  // Theme toggle logic
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem("theme") || "light" : "light";
    setTheme(savedTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme);
    }
  };

  // Mobile Header
  if (isMobile) {
    console.log('Rendering mobile header');
    return (
      <header className="top-0 z-50 shadow-md border-b border-[#F2E0D0]"
        style={{ background: "var(--header-gradient)" }}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 relative">
          <h1
            className="text-2xl font-bold text-accent cursor-pointer hover:opacity-90 transition-opacity text-blue-500"
            onClick={() => router.push("/")}
            style={{
              // fontFamily: "var(--font-heading)",
              // color: "var(--accent-color)",
            }}
          >
            <Image
              src={grabvocab}
              alt="Logo"
              width={40}
              height={40}
              className="inline mr-2"
              style={{ borderColor: "var(--border-color)" }}
            />
            GrabVocab
          </h1>
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-full shadow transition-all duration-300 ease-in-out bg-white"
            style={{
              color: "var(--accent-color)",
              borderColor: "var(--border-color)",
              transform: "scale(1)",
              backgroundColor: "var(--background-color)",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
          <button
            onClick={() => {
              console.log('Drawer button clicked');
              setDrawerOpen(true);
            }}
            // className="text-2xl text-accent p-2 hover:bg-accent/10 rounded-full transition-colors"
            aria-label="Open menu"
            className="text-2xl p-2 hover:bg-accent/10 rounded-full"
            style={{ color: 'var(--accent-color)' }}
          >
            <FaBars />
          </button>
        </div>

        {/* Search Bar for Mobile */}
        <div className="px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search words..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={handleBlur}
                style={{
                  backgroundColor: "var(--background-color)",
                  color: "var(--primary-text-color)",
                  borderColor: "var(--border-color)",
                }}
                className="w-full px-5 py-2 rounded-full border border-[#ffd6d6] shadow-sm focus:ring-2 focus:ring-[#ff6b6b] bg-white text-[#333]"
              />
              <FaSearch
                onClick={handleSearch}
                style={{ color: "var(--primary-text-color)" }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff6b6b]" />

              {suggestions.length > 0 && (
                <ul
                  ref={suggestionsRef}
                  className="absolute left-0 w-full mt-2 rounded-lg shadow-lg z-50 overflow-hidden"
                  style={{
                    backgroundColor: "var(--background-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {suggestions.map((word, index) => (
                    <li
                      key={word + index}
                      onMouseDown={() => {
                        setQuery("");
                        setSuggestions([]);
                        router.push(`/word/${word}`);
                      }}
                      className="px-5 py-3 text-sm cursor-pointer hover:bg-accent/10 transition-colors"
                      style={{
                        color: "var(--primary-text-color)",
                      }}
                    >
                      {word}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>

        {/* Mobile Drawer */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-opacity-50"
            onClick={() => setDrawerOpen(false)}
          >
            <div
              className="absolute top-0 right-0 h-full w-80 shadow-lg p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--header-gradient)',
                borderLeft: '1px solid var(--border-color)',
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--accent-color)' }}>
                  Menu
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-2xl p-2 hover:bg-accent/10 rounded-full"
                  style={{ color: 'var(--accent-color)' }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* User Info */}
              {isLoggedIn && (
                <div
                  className="mb-6 p-4 rounded-lg border"
                  style={{
                    background: 'var(--background-color)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-color)',
                  }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FaUser className="text-base" style={{ color: 'var(--accent-color)' }} />
                    <span
                      className="px-3 py-1 rounded-full border font-semibold"
                      style={{
                        background: 'var(--background-gradient)',
                        color: 'var(--primary-text-color)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {(user as any)?.username || (user as any)?.name || (user as any)?.email}
                    </span>
                  </div>
                </div>
              )}

              {/* Top Buttons */}
              <div className="space-y-3 mb-6">
                {topButtons.map((label) => (
                  <MobileDrawerButton key={label} label={label} onClose={() => setDrawerOpen(false)} />
                ))}
              </div>

              {/* Navigation Items */}
              <div className="space-y-4">
                {navItems.map((item) =>
                  typeof item === "string" ? (
                    <MobileDrawerButton key={item} label={item} onClose={() => setDrawerOpen(false)} />
                  ) : (
                    <div key={item.label} className="space-y-2">
                      <div className="font-semibold text-lg flex items-center gap-2" style={{ color: 'var(--accent-color)' }}>
                        {iconMap[item.label]}
                        {item.label}
                      </div>
                      <div className="ml-6 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <button
                            key={subItem.value}
                            onClick={() => {
                              handleSelectSubject(
                                subItem.value,
                                item.label.toLowerCase() as "subject" | "grades"
                              );
                            }}
                            className="block w-full text-left px-4 py-3 rounded-lg hover:bg-accent hover:text-white transition-colors text-sm"
                            style={{
                              backgroundColor: "var(--background-color)",
                              color: "var(--primary-text-color)",
                            }}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }

  // Desktop Header
  console.log('Rendering desktop header');
  return (
    <header className="top-0 z-50 shadow-md bg-[#FFF5EC]"
      style={{ background: "var(--header-gradient)" }}
    >
      {/* Top Section */}
      <div className="max-w-screen mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* Logo + Name */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src={grabvocab} alt="Logo" width={40} height={40} className="rounded" />
          <h1
            className="text-3xl font-bold text-blue-500"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            GrabVocab
          </h1>
        </div>

        {/* Buttons + User Info + Theme Toggle */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {topButtons.map((label) => (
            <HeaderButton key={label} label={label} />
          ))}

          {isLoggedIn && (
            <div
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--accent-color)" }}
            >
              <FaUser className="text-base" style={{ color: "var(--accent-color)" }} />
              <span className="px-3 py-1 rounded-full border text-[#4dabf7] bg-[#e6f4ff] border-[#b5dcff] font-semibold">
                {(user as any)?.username || (user as any)?.name || (user as any)?.email}
              </span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-3 rounded-full border shadow transition-all duration-300 ease-in-out"
            style={{
              color: "var(--primary-text-color)",
              borderColor: "var(--border-color)",
              backgroundColor: "var(--background-color)",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
        </div>
      </div>

      <div className="max-w-screen mx-auto flex flex-col md:flex-row md:items-center md:justify-between px-4">
        {/* Navigation */}
        <div className="flex flex-wrap gap-2 pb-4">
          {navItems.map((item) =>
            typeof item === "string" ? (
              <HeaderButton key={item} label={item} />
            ) : (
              <div
                key={item.label}
                className="relative"
                ref={(el) => {
                  dropdownRefs.current[item.label] = el;
                }}
              >
                <div onClick={() => toggleDropdown(item.label)}>
                  <HeaderButton label={item.label} />
                </div>

                {openDropdown === item.label && (
                  <div
                    ref={(el) => {
                      dropdownRefs.current[item.label] = el;
                    }}
                    className="absolute mt-2 w-48 rounded-xl shadow-xl z-20 border border-[#FFDDD6] bg-white text-[#3a3a3a]"
                  >
                    <div >
                      {item.dropdown.map((subItem) => (
                        <div
                          key={subItem.value}
                          onMouseDown={() => {
                            handleSelectSubject(
                              subItem.value,
                              item.label.toLowerCase() as "subject" | "grades"
                            );
                            setOpenDropdown(null);
                          }}
                          className="px-5 py-3 hover:bg-[#ffbaba] hover:text-white transition-colors"
                        >
                          {subItem.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
        <form
          onSubmit={handleSearch}
          className="flex-1 relative w-full md:px-3 pb-4"
        >
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search words..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
              style={{
                backgroundColor: "var(--background-color)",
                color: "var(--primary-text-color)",
                borderColor: "var(--border-color)",
              }}
              className="w-full px-5 py-2 rounded-full border border-[#ffd6d6] shadow-sm focus:ring-2 focus:ring-[#ff6b6b] bg-white text-[#333]"
            />
            <FaSearch
              onClick={handleSearch}
              style={{ color: "var(--primary-text-color)" }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff6b6b]" />

            {suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute left-0 w-full mt-2 rounded-lg shadow-lg z-50 overflow-hidden"
                style={{
                  backgroundColor: "var(--background-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                {suggestions.map((word, index) => (
                  <li
                    key={word + index}
                    onMouseDown={() => {
                      setQuery("");
                      setSuggestions([]);
                      router.push(`/word/${word}`);
                    }}
                    className="px-5 py-3 text-sm cursor-pointer hover:bg-accent/10 transition-colors"
                    style={{
                      color: "var(--primary-text-color)",
                    }}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}

function HeaderButton({ label }: { label: string }) {
  const router = useRouter();

  const handleClick = () => {
    if (label === "Logout") {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("user-updated"));
      signOut({ callbackUrl: "/" });
      return;
    }

    if (label === "Login / Signup") router.push("/auth");
    else if (label === "Dictionary A-Z") router.push("/dictionary");
    else if (label === "Quiz") router.push("/quiz/select");
    else if (label === "Social Media") router.push("/share");
    else if (label === "About Us") router.push("/about");
    else console.log(`Clicked on ${label}`);
  };

  const styles =
    buttonColorMap[label as keyof typeof buttonColorMap] ||
    "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-4 py-2 rounded-full border transition font-medium ${styles}`}
      style={{
        backgroundColor: "var(--background-color)",
        color: "var(--primary-text-color)",
        borderColor: "var(--border-color)",
      }}
    >
      <span className="flex items-center gap-1">
        {iconMap[label]}
        {label}
      </span>
    </button>
  );
}

function MobileDrawerButton({ label, onClose }: { label: string; onClose: () => void }) {
  const router = useRouter();

  const handleClick = () => {
    if (label === "Logout") {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("user-updated"));
      signOut({ callbackUrl: "/" });
      onClose();
      return;
    }

    if (label === "Login / Signup") {
      router.push("/auth");
      onClose();
    }
    else if (label === "Dictionary A-Z") {
      router.push("/dictionary");
      onClose();
    }
    else if (label === "Quiz") {
      router.push("/quiz/select");
      onClose();
    }
    else if (label === "Social Media") {
      router.push("/share");
      onClose();
    }
    else if (label === "About Us") {
      router.push("/about");
      onClose();
    }
    else {
      console.log(`Clicked on ${label}`);
      onClose();
    }
  };

  const styles =
    buttonColorMap[label as keyof typeof buttonColorMap] ||
    "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 rounded-lg border transition font-medium ${styles}`}
      style={{
        backgroundColor: "var(--background-color)",
        color: "var(--primary-text-color)",
        borderColor: "var(--border-color)",
      }}
    >
      <span className="flex items-center gap-2">
        {iconMap[label]}
        {/* {label} */}
      </span>
    </button>
  );
}
