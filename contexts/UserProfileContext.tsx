"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { db } from "@/lib/instant";
import type { UserProfile } from "@/types";

interface UserProfileContextType {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasProfile: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { isLoading: authLoading, user } = db.useAuth();
  const { data: profileData, isLoading: profileLoading } = db.useQuery(
    user ? { userProfiles: { $: { where: { userId: user.id } } } } : null
  );

  const profile = (profileData?.userProfiles?.[0] as UserProfile) || null;
  const isLoading = authLoading || (user ? profileLoading : false);
  const isAuthenticated = !!user;
  const hasProfile = !!profile;

  // Convert user to the expected type (user from db.useAuth() can be undefined)
  const userValue = user ? { id: user.id, email: user.email } : null;

  return (
    <UserProfileContext.Provider
      value={{
        user: userValue,
        profile,
        isLoading,
        isAuthenticated,
        hasProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}

