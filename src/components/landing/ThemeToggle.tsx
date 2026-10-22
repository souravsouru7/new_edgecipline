"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Light / dark switch for the homepage.
 *
 * The actual theme is an attribute on <html> (data-edg-theme), set before paint
 * by a tiny inline script in the root layout so there is no flash. This button
 * only flips that attribute and mirrors the choice to localStorage; the dark
 * palette itself lives in reference-theme.css, keyed off that attribute. The
 * sun/moon icons are shown/hidden from the attribute too, so the control can
 * never disagree with what is on screen.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = (document.documentElement.dataset.edgTheme as Theme) || "light";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      setTheme(next);
      document.documentElement.dataset.edgTheme = next;
      try {
        localStorage.setItem("edg-theme", next);
      } catch {
        // Private mode or blocked storage: the choice simply doesn't persist.
      }
    };

    // A View Transition cross-fades the whole page between palettes where the
    // browser supports it; elsewhere the per-property CSS transitions in
    // reference-theme.css carry the change. Skipped under reduced motion.
    const vt = (document as Document & {
      startViewTransition?: (cb: () => void) => void;
    }).startViewTransition;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof vt === "function" && !reduced) {
      vt.call(document, apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      className="edg-theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
    >
      <Sun size={16} strokeWidth={1.8} className="edg-theme-sun" aria-hidden="true" />
      <Moon size={16} strokeWidth={1.8} className="edg-theme-moon" aria-hidden="true" />
    </button>
  );
}
