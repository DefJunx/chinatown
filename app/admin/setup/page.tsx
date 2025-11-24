"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant";
import { UserPlus } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await db.auth.signInWithMagicCode({ email, code });
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err: unknown) {
      console.error("Verify code error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid code. Please check and try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-5xl font-bold text-white">
              ✓
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Account Created!
          </h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Create Admin Account
          </h1>
          <p className="mt-2 text-gray-600">Set up your first admin account</p>
        </div>

        <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <strong>Note:</strong> This is a one-time setup page. After creating
          your account, consider removing this route for security.
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
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
              {isSubmitting ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setCode("");
                setError("");
              }}
              className="w-full text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to email entry
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Already have an account?</p>
          <a
            href="/admin/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Sign in instead
          </a>
        </div>
      </div>
    </div>
  );
}
