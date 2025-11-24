"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isLoading, user, error } = db.useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration error by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/admin/dashboard");
    }
  }, [isLoading, user, router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);

    try {
      await db.auth.sendMagicCode({ email });
      setCodeSent(true);
    } catch (err: unknown) {
      console.error("Send code error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send verification code. Please try again.";
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);

    try {
      await db.auth.signInWithMagicCode({ email, code });
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      console.error("Verify code error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid code. Please check and try again.";
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading during SSR and initial client render
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="mt-2 text-gray-600">Sign in to manage orders</p>
        </div>

        {loginError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {loginError}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error.message}
          </div>
        )}

        {!codeSent ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="admin@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              Check your email for a verification code.
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setCode("");
                setLoginError("");
              }}
              className="w-full text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to email entry
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>First time? Enter your email above to create an account.</p>
        </div>
      </div>
    </div>
  );
}
