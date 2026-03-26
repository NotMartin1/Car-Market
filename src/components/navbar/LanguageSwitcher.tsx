"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/translations";

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "lt", flag: "🇱🇹", label: "LT" },
];

export function LanguageSwitcher({
  lang,
  setLang,
  isOpen,
  setOpen,
  menuRef,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  const currentLang = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold transition-colors",
          isOpen ? "bg-muted" : "hover:bg-muted",
        )}
      >
        <span>{currentLang.flag}</span>
        <span className="text-foreground">{currentLang.label}</span>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-32 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                lang === l.code ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
              )}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.code && <span className="ml-auto text-primary text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
