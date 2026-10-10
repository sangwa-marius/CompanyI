"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: "light" | "dark";
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const storageKey = "companyi-theme-preference";

function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const storedPreference = window.localStorage.getItem(storageKey);
  return storedPreference === "light" || storedPreference === "dark" || storedPreference === "system"
    ? storedPreference
    : "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredPreference);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (selectedPreference: ThemePreference) => {
      const nextTheme = selectedPreference === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : selectedPreference;
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.style.colorScheme = nextTheme;
      setResolvedTheme(nextTheme);
    };

    applyTheme(preference);
    const handleSystemChange = () => {
      if (preference === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [preference]);

  const setPreference = (nextPreference: ThemePreference) => {
    window.localStorage.setItem(storageKey, nextPreference);
    setPreferenceState(nextPreference);
  };

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useTheme must be used within ThemeProvider");
  return theme;
}
