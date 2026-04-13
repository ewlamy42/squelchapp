import { Moon, Sun } from "lucide-react";
import { useApp } from "./AppContext";

export function ThemeToggle() {
  const { theme, setTheme } = useApp();

  return (
    <div className="retro-button inline-flex items-center gap-1 rounded-full bg-[#fff9ef] p-1 text-[#181457] dark:bg-[#fff9ef]">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
          theme === "light"
            ? "bg-[#ffef9c] text-[#21185b]"
            : "text-[#6e6597] hover:bg-white/70"
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          <Sun size={14} />
          <span>Light</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
          theme === "dark"
            ? "bg-[#181457] text-[#fff9ef]"
            : "text-[#6e6597] hover:bg-white/70"
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          <Moon size={14} />
          <span>Dark</span>
        </span>
      </button>
    </div>
  );
}
