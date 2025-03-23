import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

// Available image generation models
export type ImageModel =
  | "sd-xl-base"
  | "sd-v1-5"
  | "sd-3-5-large"
  | "flux-1-dev";

// Theme options
export type ColorTheme = "light" | "dark" | "system";

// Settings interface
export interface AppSettings {
  imageModel: ImageModel;
  colorTheme: ColorTheme;
  isPro: boolean;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  imageModel: "sd-xl-base",
  colorTheme: "system",
  isPro: false,
};

// Storage key for AsyncStorage
const SETTINGS_STORAGE_KEY = "pragmatic_app_settings";

/**
 * Hook for managing app settings
 */
export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const deviceTheme = useColorScheme();

  // Calculate current theme based on settings and device theme
  const currentTheme =
    settings.colorTheme === "system"
      ? deviceTheme || "light"
      : settings.colorTheme;

  // Load settings from AsyncStorage on first render
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(updatedSettings)
      );
      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_SETTINGS)
      );
      setSettings(DEFAULT_SETTINGS);
      return true;
    } catch (error) {
      console.error("Error resetting settings:", error);
      return false;
    }
  };

  return {
    settings,
    currentTheme,
    loading,
    updateSettings,
    resetSettings,
  };
};
