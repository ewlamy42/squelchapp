import { Moon, Sun } from "lucide-react";
import { useApp } from "./AppContext";

export function ThemeToggle() {
  const { theme, setTheme } = useApp();

  return (
    <div className="retro-button inline-flex items-center gap-1 rounded-full bg-[#ffffff] p-1 text-[#1a1a1a] dark:bg-[#ffffff]">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
          theme === "light"
            ? "bg-[#e5e5e5] text-[#1a1a1a]"
            : "text-[#666666] hover:bg-white/70"
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
            ? "bg-[#1a1a1a] text-[#ffffff]"
            : "text-[#666666] hover:bg-white/70"
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
