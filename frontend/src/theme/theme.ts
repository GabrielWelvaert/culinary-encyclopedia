import { useCallback, useState } from "react";

export type Theme = "light" | "dark";

// Keep in sync with the inline script in index.html.
const STORAGE_KEY = "theme";

const currentTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

/**
 * Apply the theme class with CSS transitions suppressed, so elements with
 * hover transitions (e.g. `transition-colors`) switch instantly with the rest of the page.
 */
function applyTheme(theme: Theme) {
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);

  document.documentElement.classList.toggle("dark", theme === "dark");

  // Force a style recalculation so the new colors are committed while transitions are off.
  void window.getComputedStyle(document.body).color;
  requestAnimationFrame(() => style.remove());
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode, blocked); theme still applies for this session.
    }
    setTheme(next);
  }, []);

  return { theme, toggleTheme };
}
