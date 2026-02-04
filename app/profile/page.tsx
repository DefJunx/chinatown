"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, id } from "@/lib/instant";
import { User, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { UserProfile } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoading: authLoading, user } = db.useAuth();
  const { data: profileData, isLoading: profileLoading } = db.useQuery(
    user ? { userProfiles: { $: { where: { userId: user.id } } } } : null
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredCutlery, setPreferredCutlery] = useState<
    "forks" | "chopsticks" | "none"
  >("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const existingProfile = (profileData?.userProfiles?.[0] as UserProfile) || null;
  const isNewUser = !existingProfile;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Load existing profile data
  useEffect(() => {
    if (existingProfile) {
      setFirstName(existingProfile.firstName || "");
      setLastName(existingProfile.lastName || "");
      setPreferredCutlery(existingProfile.preferredCutlery || "none");
    }
  }, [existingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const profileId = existingProfile?.id || id();
      const now = Date.now();

      await db.transact([
        db.tx.userProfiles[profileId].update({
          userId: user.id,
          email: user.email || "",
          firstName,
          lastName,
          preferredCutlery,
          isAdmin: existingProfile?.isAdmin || false, // Preserve admin status or default to false
          slackUserId: existingProfile?.slackUserId, // Preserve Slack user ID
          createdAt: existingProfile?.createdAt || now,
          updatedAt: now,
        }),
      ]);

      toast.success(
        isNewUser ? "Profilo creato con successo!" : "Profilo aggiornato!"
      );

      // Redirect to menu after profile creation/update
      router.push("/");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Impossibile salvare il profilo. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted || authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isNewUser ? "Completa il Profilo" : "Il Tuo Profilo"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isNewUser
              ? "Inserisci i tuoi dati per continuare"
              : "Modifica le tue informazioni"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={user.email || ""}
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Il tuo cognome"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Posate Preferite
            </label>
            <p className="mb-3 text-xs text-gray-500">
              Questa preferenza verrà usata come default quando ordini, ma potrai
              cambiarla per ogni ordine.
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-md border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
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
              <label className="flex items-center gap-3 rounded-md border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
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
              <label className="flex items-center gap-3 rounded-md border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
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
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <Save size={20} />
            {isSubmitting
              ? "Salvataggio..."
              : isNewUser
                ? "Crea Profilo"
                : "Salva Modifiche"}
          </button>
        </form>

        {!isNewUser && (
          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Torna al Menu
          </button>
        )}
      </div>
    </div>
  );
}

