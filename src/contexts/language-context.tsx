"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setLang } from "@/store/slices/languageSlice";
import { translations, type Lang, type Translations } from "@/lib/translations";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useLanguage(): { lang: Lang; setLang: (l: Lang) => void; t: Translations } {
  const dispatch = useAppDispatch();
  const lang     = useAppSelector((s) => s.language.lang);

  return {
    lang,
    setLang: (l: Lang) => dispatch(setLang(l)),
    t:       translations[lang],
  };
}
