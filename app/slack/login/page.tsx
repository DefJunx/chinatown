"use client";

import React, { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/instant";
import { User, Slack, Loader2 } from "lucide-react";
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

function SlackLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, user } = db.useAuth();
  const { data: profileData, isLoading: profileLoading } = db.useQuery(
    user ? { userProfiles: { $: { where: { userId: user.id } } } } : null
  );

  const token = searchParams.get("token") || "";

  // Token verification state
  const [tokenData, setTokenData] = useState<{
    email: string;
    slackUserId: string;
  } | null>(null);
  const [tokenError, setTokenError] = useState("");
  const [verifyingToken, setVerifyingToken] = useState(true);

  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const codeSentRef = useRef(false);
  const profileUpdateRef = useRef(false);

  const sendMagicCode = useCallback(async () => {
    if (!tokenData?.email) {
      setLoginError("Email mancante. Usa il comando /ordina da Slack.");
      return;
    }

    setLoginError("");
    setIsSubmitting(true);

    try {
      await db.auth.sendMagicCode({ email: tokenData.email });
      setCodeSent(true);
      toast.success("Codice di verifica inviato!");
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
  }, [tokenData?.email]);

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
        setVerifyingToken(false);
      } catch {
        setTokenError("Errore durante la verifica del token");
        setVerifyingToken(false);
      }
    };

    verifyToken();
  }, [isMounted, token]);

  // Auto-send magic code after token verification
  useEffect(() => {
    if (tokenData?.email && !codeSentRef.current && !user) {
      codeSentRef.current = true;
      sendMagicCode();
    }
  }, [tokenData, user, sendMagicCode]);

  // Handle successful login - update profile with slackUserId if needed
  useEffect(() => {
    if (
      !isLoading &&
      !profileLoading &&
      user &&
      tokenData?.slackUserId &&
      !profileUpdateRef.current
    ) {
      const profile = (profileData?.userProfiles?.[0] as UserProfile) || null;

      if (profile && !profile.slackUserId) {
        // Prevent duplicate updates
        profileUpdateRef.current = true;

        // Update profile with slackUserId
        db.transact([
          db.tx.userProfiles[profile.id].update({
            slackUserId: tokenData.slackUserId,
            updatedAt: Date.now(),
          }),
        ])
          .then(() => {
            toast.success("Account Slack collegato!");
            router.push("/");
          })
          .catch((err) => {
            console.error("Failed to update profile with slackUserId:", err);
            router.push("/");
          });
      } else if (profile) {
        // Profile already has slackUserId or doesn't need update
        router.push("/");
      } else {
        // No profile exists, redirect to profile setup
        router.push("/profile");
      }
    }
  }, [isLoading, profileLoading, user, profileData, tokenData, router]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenData?.email) return;

    setLoginError("");
    setIsSubmitting(true);

    try {
      await db.auth.signInWithMagicCode({ email: tokenData.email, code });
      // The useEffect will handle the redirect and profile update
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

  if (!isMounted || isLoading || verifyingToken) {
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
            Slack per accedere.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Accesso da Slack</h1>
          <p className="mt-2 text-gray-600">
            Verifica la tua email per continuare
          </p>
        </div>

        {loginError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {loginError}
          </div>
        )}

        {!codeSent ? (
          <div className="text-center">
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Invio codice a {tokenData?.email}...
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              Codice inviato a {tokenData?.email}
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
              {isSubmitting ? "Verifica in corso..." : "Verifica Codice"}
            </button>

            <button
              type="button"
              onClick={sendMagicCode}
              disabled={isSubmitting}
              className="w-full text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              Invia nuovo codice
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Slack size={16} />
          Accesso tramite Slack
        </div>
      </div>
    </div>
  );
}

export default function SlackLoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SlackLoginContent />
    </Suspense>
  );
}
