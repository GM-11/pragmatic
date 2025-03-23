import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isProSubscriber: boolean;
  loading: boolean;
  error: string | null;
  provider?: "email" | "google" | "github";
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  upgradeToProSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
