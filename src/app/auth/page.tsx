"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import React from "react";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (status === "loading") return;

    const isLocalUser = !!stored;
    const isGoogleUser = !!session?.user?.email;

    if (isLocalUser || isGoogleUser) {
      router.replace("/");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email,
      password,
      ...(isLogin ? {} : { username }),
    };

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent("user-updated", { detail: data.user }));
        router.push("/");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.log("❌ Auth request failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-10" style={{
      backgroundColor: "var(--background-color)",
      color: "var(--primary-text-color)",
    }}>
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-md"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--primary-text-color)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login to GrabVocab" : "Create an Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              style={{
                backgroundColor: "var(--background-color)",
                color: "var(--primary-text-color)",
                borderColor: "var(--border-color)",
              }}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            style={{
              backgroundColor: "var(--background-color)",
              color: "var(--primary-text-color)",
              borderColor: "var(--border-color)",
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            style={{
              backgroundColor: "var(--background-color)",
              color: "var(--primary-text-color)",
              borderColor: "var(--border-color)",
            }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg transition"
            style={{
              backgroundColor: loading ? "gray" : "var(--accent-color)",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center" style={{ color: "var(--muted-text-color)" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="font-semibold"
            style={{ color: "var(--accent-color)" }}
          >
            {isLogin ? "Sign up here" : "Login here"}
          </button>
        </p>

        <button
          type="button"
          onClick={() => signIn("google")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 my-4 rounded-lg transition"
          style={{
            backgroundColor: "#DB4437",
            color: "white",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <FaGoogle className="text-lg" />
          {loading ? "Signing in with Google..." : "Sign in with Google"}
        </button>

        <button
          type="button"
          onClick={() => signIn("facebook")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 my-2 rounded-lg transition"
          style={{
            backgroundColor: "#1877F2",
            color: "white",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <FaFacebook className="text-lg" />
          {loading ? "Signing in with Facebook..." : "Sign in with Facebook"}
        </button>
      </div>
    </div>
  );
}