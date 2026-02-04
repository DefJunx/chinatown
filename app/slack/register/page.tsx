"use client";

import React, { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db, id } from "@/lib/instant";
import { User, Slack, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { UserProfile } from "@/types";

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        Caricamento...
      </div>
    </div>
  );
}

function SlackRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: authLoading, user } = db.useAuth();
  const { data: profileData, isLoading: profileLoading } = db.useQuery(
    user ? { userProfiles: { $: { where: { userId: user.id } } } } : null
  );

  // Get data from URL params
  const token = searchParams.get("token") || "";
  const firstNameParam = searchParams.get("first_name") || "";
  const lastNameParam = searchParams.get("last_name") || "";

  // Token verification state
  const [tokenData, setTokenData] = useState<{
    email: string;
    slackUserId: string;
  } | null>(null);
  const [tokenError, setTokenError] = useState("");
  const [verifyingToken, setVerifyingToken] = useState(true);

  // Form state
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState(firstNameParam);
  const [lastName, setLastName] = useState(lastNameParam);
  const [preferredCutlery, setPreferredCutlery] = useState<
    "forks" | "chopsticks" | "none"
  >("none");

  // UI state
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const codeSentRef = useRef(false);
  const profileUpdateRef = useRef(false);

  const sendMagicCode = useCallback(async () => {
    const emailToUse = email || tokenData?.email;
    if (!emailToUse) {
      setError("Email obbligatoria.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await db.auth.sendMagicCode({ email: emailToUse });
      setCodeSent(true);
      toast.success("Codice di verifica inviato!");
    } catch (err: unknown) {
      console.error("Send code error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Impossibile inviare il codice. Riprova."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [email, tokenData?.email]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verify token on mount
  useEffect(() => {
    if (!isMounted || !token) {
      setVerifyingToken(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("/api/slack/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          setTokenError(data.error || "Token non valido");
          setVerifyingToken(false);
          return;
        }

        const data = await response.json();
        setTokenData(data);
        // Pre-fill email from token if available
        if (data.email) {
          setEmail(data.email);
        }
        setVerifyingToken(false);
      } catch {
        setTokenError("Errore durante la verifica del token");
        setVerifyingToken(false);
      }
    };

    verifyToken();
  }, [isMounted, token]);

  // Auto-send magic code after token verification (if email available)
  useEffect(() => {
    if (tokenData?.email && !codeSentRef.current && !user) {
      codeSentRef.current = true;
      sendMagicCode();
    }
  }, [tokenData, user, sendMagicCode]);

  // Check if user is already logged in and has a profile
  useEffect(() => {
    if (
      !authLoading &&
      !profileLoading &&
      user &&
      tokenData?.slackUserId &&
      !profileUpdateRef.current
    ) {
      const existingProfile =
        (profileData?.userProfiles?.[0] as UserProfile) || null;

      if (existingProfile) {
        // Already has profile, just update slackUserId if needed
        if (!existingProfile.slackUserId) {
          profileUpdateRef.current = true;
          db.transact([
            db.tx.userProfiles[existingProfile.id].update({
              slackUserId: tokenData.slackUserId,
              updatedAt: Date.now(),
            }),
          ])
            .then(() => {
              toast.success("Account Slack collegato!");
              router.push("/");
            })
            .catch(() => router.push("/"));
        } else {
          router.push("/");
        }
      } else {
        // User authenticated but no profile - show profile form
        setCodeVerified(true);
      }
    }
  }, [authLoading, profileLoading, user, profileData, tokenData, router]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = email || tokenData?.email;
    if (!emailToUse) return;

    setError("");
    setIsSubmitting(true);

    try {
      await db.auth.signInWithMagicCode({ email: emailToUse, code });
      setCodeVerified(true);
      toast.success("Email verificata!");
    } catch (err: unknown) {
      console.error("Verify code error:", err);
      setError(
        err instanceof Error ? err.message : "Codice non valido. Riprova."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tokenData?.slackUserId) return;

    setError("");
    setIsSubmitting(true);

    try {
      const profileId = id();
      const now = Date.now();

      await db.transact([
        db.tx.userProfiles[profileId].update({
          userId: user.id,
          email: user.email || email,
          firstName,
          lastName,
          preferredCutlery,
          isAdmin: false,
          slackUserId: tokenData.slackUserId,
          createdAt: now,
          updatedAt: now,
        }),
      ]);

      toast.success("Registrazione completata!");
      router.push("/");
    } catch (err) {
      console.error("Failed to create profile:", err);
      setError("Impossibile creare il profilo. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted || authLoading || verifyingToken) {
    return <LoadingFallback />;
  }

  if (!token || tokenError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Slack size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {tokenError || "Link non valido"}
          </h1>
          <p className="text-gray-600">
            Usa il comando{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">/ordina</code> da
            Slack per registrarti.
          </p>
        </div>
      </div>
    );
  }

  const currentEmail = email || tokenData?.email;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {codeVerified ? "Completa Registrazione" : "Registrati da Slack"}
          </h1>
          <p className="mt-2 text-gray-600">
            {codeVerified
              ? "Inserisci i tuoi dati per completare"
              : "Verifica la tua email per continuare"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!codeVerified ? (
          // Email verification step
          <>
            {!codeSent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMagicCode();
                }}
                className="space-y-4"
              >
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
                    autoComplete="email"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="tua@email.com"
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
                  Codice inviato a {currentEmail}
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
                    autoFocus
                    autoComplete="one-time-code"
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
                  {isSubmitting ? "Verifica..." : "Verifica Codice"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setCode("");
                    setError("");
                    codeSentRef.current = false;
                  }}
                  className="w-full text-sm text-primary-600 hover:text-primary-700"
                >
                  Modifica email
                </button>
              </form>
            )}
          </>
        ) : (
          // Profile creation step
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label
                htmlFor="profileEmail"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="profileEmail"
                value={user?.email || email}
                disabled
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Cognome
              </label>
              <input
                type="text"
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
                autoComplete="family-name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Il tuo cognome"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Posate Preferite
              </label>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                  <input
                    type="radio"
                    name="cutlery"
                    value="none"
                    checked={preferredCutlery === "none"}
                    onChange={() => setPreferredCutlery("none")}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Nessuna preferenza</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                  <input
                    type="radio"
                    name="cutlery"
                    value="forks"
                    checked={preferredCutlery === "forks"}
                    onChange={() => setPreferredCutlery("forks")}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Forchetta</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                  <input
                    type="radio"
                    name="cutlery"
                    value="chopsticks"
                    checked={preferredCutlery === "chopsticks"}
                    onChange={() => setPreferredCutlery("chopsticks")}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">Bacchette</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-primary-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              <Save size={20} />
              {isSubmitting ? "Salvataggio..." : "Completa Registrazione"}
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Slack size={16} />
          Registrazione tramite Slack
        </div>
      </div>
    </div>
  );
}

export default function SlackRegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SlackRegisterContent />
    </Suspense>
  );
}
