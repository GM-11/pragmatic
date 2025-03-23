import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { useSettings } from "./useSettings";

// Define theme colors for both light and dark modes
export type ThemeColors = {
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  secondaryText: string;
  primary: string;
  secondary: string;
  accent: string;
  statusBar: "light-content" | "dark-content";
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  modalBackground: string;
  modalOverlay: string;
};

// Theme context type
type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

// Define light theme colors
const lightColors: ThemeColors = {
  background: "#ffffff",
  card: "#ffffff",
  cardBorder: "#f1f1f1",
  text: "#333333",
  secondaryText: "#666666",
  primary: "#e11d48", // Rose-600
  secondary: "#f43f5e", // Rose-500
  accent: "#fff1f2", // Rose-50
  statusBar: "dark-content",
  inputBackground: "#f9fafb", // Gray-50
  inputBorder: "#f3f4f6", // Gray-100
  inputPlaceholder: "#9ca3af", // Gray-400
  modalBackground: "#ffffff",
  modalOverlay: "rgba(0, 0, 0, 0.5)",
};

// Define dark theme colors
const darkColors: ThemeColors = {
  background: "#121212",
  card: "#1e1e1e",
  cardBorder: "#2d2d2d",
  text: "#e5e5e5",
  secondaryText: "#a1a1a1",
  primary: "#f43f5e", // Rose-500
  secondary: "#fb7185", // Rose-400
  accent: "#450a17", // Darker rose
  statusBar: "light-content",
  inputBackground: "#1c1c1c",
  inputBorder: "#2d2d2d",
  inputPlaceholder: "#6b7280", // Gray-500
  modalBackground: "#1e1e1e",
  modalOverlay: "rgba(0, 0, 0, 0.7)",
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const deviceTheme = useColorScheme();
  const { settings } = useSettings();

  // Determine if we should use dark mode
  const [isDark, setIsDark] = useState(() => {
    if (settings.colorTheme === "system") {
      return deviceTheme === "dark";
    }
    return settings.colorTheme === "dark";
  });

  // Update theme immediately when settings or device theme changes
  useEffect(() => {
    const newIsDark =
      settings.colorTheme === "system"
        ? deviceTheme === "dark"
        : settings.colorTheme === "dark";

    if (newIsDark !== isDark) {
      setIsDark(newIsDark);
    }
  }, [deviceTheme, settings.colorTheme]);

  // Function to toggle the theme manually
  const toggleTheme = React.useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Memoize the colors to prevent unnecessary re-renders
  const colors = React.useMemo(
    () => (isDark ? darkColors : lightColors),
    [isDark]
  );

  const value = React.useMemo(
    () => ({
      isDark,
      colors,
      toggleTheme,
    }),
    [isDark, colors, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
