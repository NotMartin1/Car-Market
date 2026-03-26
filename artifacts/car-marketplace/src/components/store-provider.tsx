"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { initSaved } from "@/store/slices/savedSlice";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const raw = localStorage.getItem("automarket_saved");
      if (raw) store.dispatch(initSaved(JSON.parse(raw)));
    } catch {}
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
