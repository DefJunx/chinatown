"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant";
import { UserPlus, AlertTriangle } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const { data, isLoading } = db.useQuery({ systemSettings: {} });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState(true);

  // Check if admin registration is allowed
  useEffect(() => {
    if (data?.systemSettings && data.systemSettings.length > 0) {
      const settings = data.systemSettings[0] as any;
      setIsRegistrationAllowed(settings.allowAdminRegistration ?? true);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 px-4">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    );
  }

  // Show access denied if registration is disabled
  if (!isRegistrationAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white">
              <AlertTriangle size={40} />
            </div>
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Registrazione Disabilitata
          </h2>
          <p className="mb-6 text-center text-gray-600">
            La registrazione admin è attualmente disabilitata. Contatta un
            amministratore esistente per abilitarla.
          </p>
          <button
            onClick={() => router.push("/admin/login")}
            className="w-full rounded-md bg-primary-600 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700"
          >
            Vai al Login
          </button>
        </div>
      </div>
    );
  }

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
          : "Impossibile inviare il codice di verifica. Riprova.";
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
          : "Codice non valido. Controlla e riprova.";
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
            Crea Account Admin
          </h1>
          <p className="mt-2 text-gray-600">Configura il tuo primo account admin</p>
        </div>

        <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <strong>Nota:</strong> Questa è una pagina di configurazione una tantum. Dopo aver creato
          il tuo account, considera di rimuovere questa pagina per sicurezza.
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
              {isSubmitting ? "Verifica in corso..." : "Verifica e Crea Account"}
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
              ← Torna all&apos;inserimento email
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Hai già un account?</p>
          <a
            href="/admin/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Accedi invece
          </a>
        </div>
      </div>
    </div>
  );
}
