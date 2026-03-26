"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal() {
  const { isOpen, tab, close, switchTab } = useAuthModal();
  const { login } = useMockAuth();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else        document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  const a = t.auth;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      <div className="relative w-full max-w-md bg-background rounded-3xl shadow-2xl overflow-hidden">
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex border-b border-border">
          {(["login", "register"] as const).map((tKey) => (
            <button
              key={tKey}
              onClick={() => switchTab(tKey)}
              className={cn(
                "flex-1 py-4 text-sm font-semibold transition-colors relative",
                tab === tKey ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tKey === "login" ? a.tabLogIn : a.tabSignUp}
              {tab === tKey && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
            </button>
          ))}
        </div>

        <div className="px-7 py-6 overflow-y-auto max-h-[80vh] styled-scrollbar">
          {tab === "login" ? (
            <LoginForm a={a} onSuccess={close} login={login} switchTab={() => switchTab("register")} />
          ) : (
            <RegisterForm a={a} onSuccess={close} login={login} switchTab={() => switchTab("login")} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
