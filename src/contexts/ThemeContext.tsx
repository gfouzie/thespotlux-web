"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
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
  defaultTheme = "light", // Default to light mode
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Apply theme immediately on component mount
  useLayoutEffect(() => {
    const root = document.documentElement;

    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
    }
  }, [theme]);

  // Handle hydration and sync with localStorage
  useEffect(() => {
    setIsHydrated(true);

    // Check what theme was set by the inline script
    const currentTheme = document.documentElement.getAttribute(
      "data-theme"
    ) as Theme;
    if (currentTheme && (currentTheme === "light" || currentTheme === "dark")) {
      setTheme(currentTheme);
    } else {
      // Fallback to localStorage or defaultTheme
      const savedTheme = localStorage.getItem("spotlux-theme") as Theme;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        setTheme(savedTheme);
      } else {
        setTheme(defaultTheme);
      }
    }
  }, [defaultTheme]);

  // Save theme to localStorage when it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("spotlux-theme", theme);
    }
  }, [theme, isHydrated]);

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
