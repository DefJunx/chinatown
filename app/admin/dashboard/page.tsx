"use client";

import React, { useState, useEffect } from "react";
import { AdminOrderList } from "@/components/AdminOrderList";
import { db, id } from "@/lib/instant";
import { Settings, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data } = db.useQuery({ systemSettings: {} });
  const [allowAdminRegistration, setAllowAdminRegistration] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Load current settings
  useEffect(() => {
    if (data?.systemSettings && data.systemSettings.length > 0) {
      const settings = data.systemSettings[0] as any;
      setAllowAdminRegistration(settings.allowAdminRegistration ?? false);
      setSettingsId(settings.id);
    }
  }, [data]);

  const handleToggleAdminRegistration = async () => {
    setIsSaving(true);
    const newValue = !allowAdminRegistration;

    try {
      // If no settings exist yet, create with a new UUID
      const targetId = settingsId || id();

      await db.transact([
        db.tx.systemSettings[targetId].update({
          allowAdminRegistration: newValue,
          updatedAt: Date.now(),
        }),
      ]);

      // Update local state
      if (!settingsId) {
        setSettingsId(targetId);
      }
      setAllowAdminRegistration(newValue);

      toast.success(
        newValue
          ? "Registrazione admin abilitata"
          : "Registrazione admin disabilitata"
      );
    } catch (err) {
      console.error("Failed to update settings:", err);
      toast.error("Impossibile aggiornare le impostazioni. Riprova.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Amministratore</h1>
        <p className="text-gray-600 mt-1">
          Consolida gli ordini di oggi per facilitare l&apos;ordinazione
        </p>
      </div>

      {/* System Settings */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Settings size={24} className="text-gray-700" />
          <h2 className="text-xl font-bold text-gray-800">Impostazioni di Sistema</h2>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              Consenti Registrazione Admin
            </h3>
            <p className="text-sm text-gray-600">
              Abilita o disabilita la pagina per creare nuovi account admin su{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5">/admin/setup</code>
            </p>
          </div>
          <button
            onClick={handleToggleAdminRegistration}
            disabled={isSaving}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              allowAdminRegistration ? "bg-primary-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                allowAdminRegistration ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Create New Admin Button */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <button
            onClick={() => router.push("/admin/setup")}
            disabled={!allowAdminRegistration}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus size={20} />
            Crea Nuovo Admin
          </button>
          {!allowAdminRegistration && (
            <p className="mt-2 text-sm text-gray-500">
              Abilita la registrazione admin sopra per creare nuovi account admin
            </p>
          )}
        </div>
      </div>

      <AdminOrderList />
    </div>
  );
}
