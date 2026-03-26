import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { translations, type Lang } from "@/lib/translations";

interface LanguageState {
  lang: Lang;
}

const initialState: LanguageState = { lang: "en" };

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<Lang>) {
      state.lang = action.payload;
    },
  },
});

export const { setLang } = languageSlice.actions;

export const selectTranslations = (lang: Lang) => translations[lang];

export default languageSlice.reducer;
