import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    
    // Then check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "light";
    }
    return "light";
  });

  // const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "orange");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => setTheme(newTheme),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 