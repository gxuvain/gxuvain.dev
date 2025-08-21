"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    return () => {
      setMounted(true);
    };
  }, []);

  if (!mounted)
    return null;

  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark"
        ? (
            <Sun size={20} className="text-yellow-500" />
          )
        : (
            <Moon size={20} className="text-gray-600 dark:text-gray-400" />
          )}
    </button>
  );
}

export default ThemeSwitcher;
