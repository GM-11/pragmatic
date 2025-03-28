import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isProSubscriber: boolean;
  loading: boolean;
  error: string | null;
  provider?: "email" | "google" | "github";
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isProSubscriber: false,
    loading: true,
    error: null,
  });

  const loadAuthState = useCallback(async () => {
    try {
      // Check current session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (session?.user) {
        // Load pro status from local storage
        const proStatus = await AsyncStorage.getItem("@pro_status");

        setAuthState({
          isAuthenticated: true,
          user: session.user,
          isProSubscriber: proStatus === "true",
          loading: false,
          error: null,
        });
      } else {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load authentication state",
      }));
    }
  }, []);

  useEffect(() => {
    loadAuthState();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const proStatus = await AsyncStorage.getItem("@pro_status");
        setAuthState({
          isAuthenticated: true,
          user: session.user,
          isProSubscriber: proStatus === "true",
          loading: false,
          error: null,
        });
      } else if (event === "SIGNED_OUT") {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isProSubscriber: false,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadAuthState]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          isAuthenticated: true,
          user: data.user,
        }));
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to sign in",
      }));
      throw error;
    }
  };

  const insertUserData = async (email: string) => {
    try {
      const { error } = await supabase.from("users").upsert(
        {
          email,
          subscribed: true, // Setting subscribed to true for pro users
        },
        {
          onConflict: "email",
        }
      );
      if (error) throw error;
    } catch (error) {
      console.error("Error inserting user data:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          isAuthenticated: true,
          user: data.user,
        }));
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to sign up",
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to sign out",
      }));
      throw error;
    }
  };

  const upgradeToProSubscription = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      // In a real app, this would interact with a payment system
      await AsyncStorage.setItem("@pro_status", "true");

      // Only add user data to database when upgrading to pro
      if (authState.user?.email) {
        await insertUserData(authState.user.email);
      }

      setAuthState((prev) => ({
        ...prev,
        isProSubscriber: true,
        loading: false,
      }));
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to upgrade subscription",
      }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "pragmatic://",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;

      // Listen for auth state change after OAuth redirect
      const authListener = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session?.user?.email) {
            try {
              setAuthState((prev) => ({
                ...prev,
                isAuthenticated: true,
                user: session.user,
                provider: "google",
                loading: false,
              }));
            } catch (error) {
              setAuthState((prev) => ({
                ...prev,
                loading: false,
                error: "Failed to complete Google sign in",
              }));
            } finally {
              authListener.data.subscription.unsubscribe();
            }
          }
        }
      );
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to sign in with Google",
      }));
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: "pragmatic://",
          scopes: "user:email",
        },
      });
      if (error) throw error;

      // Listen for auth state change after OAuth redirect
      const authListener = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session?.user?.email) {
            try {
              setAuthState((prev) => ({
                ...prev,
                isAuthenticated: true,
                user: session.user,
                provider: "github",
                loading: false,
              }));
            } catch (error) {
              setAuthState((prev) => ({
                ...prev,
                loading: false,
                error: "Failed to complete GitHub sign in",
              }));
            } finally {
              authListener.data.subscription.unsubscribe();
            }
          }
        }
      );
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to sign in with GitHub",
      }));
      throw error;
    }
  };

  return {
    ...authState,
    signInWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signUp,
    signOut,
    upgradeToProSubscription,
  };
};
