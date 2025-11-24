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
          : "Impossibile inviare il codice di verifica. Riprova.";
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
          : "Codice non valido. Controlla e riprova.";
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading during SSR and initial client render
  if (!isMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Caricamento...</div>
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
          <h1 className="text-3xl font-bold text-gray-800">Accesso Amministratore</h1>
          <p className="mt-2 text-gray-600">Accedi per gestire gli ordini</p>
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
              {isSubmitting ? "Invio codice..." : "Invia Codice di Verifica"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              Controlla la tua email per il codice di verifica.
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
                Codice di Verifica
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Inserisci codice a 6 cifre"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Verifica in corso..." : "Verifica Codice"}
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
              ← Torna all&apos;inserimento email
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Prima volta? Inserisci la tua email sopra per creare un account.</p>
        </div>
      </div>
    </div>
  );
}
