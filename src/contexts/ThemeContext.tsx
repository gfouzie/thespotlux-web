"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider = ({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [theme]);

  // Initialize theme on mount (can check localStorage if you want persistence)
  useEffect(() => {
    // Prevent hydration mismatch by only reading localStorage on client
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("spotlux-theme") as Theme;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setTheme(savedTheme);
      } else {
        setTheme(defaultTheme);
      }
    }
  }, [defaultTheme]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spotlux-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
