"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SocialButton({
  provider, loading, disabled, onClick, label,
}: {
  provider: "google" | "facebook";
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  const isGoogle = provider === "google";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-11 flex items-center justify-center gap-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm",
        isGoogle
          ? "bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]"
          : "bg-[#1877f2] text-white hover:bg-[#166fe5]",
      )}
    >
      {loading ? (
        <span className={cn("w-4 h-4 border-2 rounded-full animate-spin", isGoogle ? "border-[#3c4043]/30 border-t-[#3c4043]" : "border-white/30 border-t-white")} />
      ) : provider === "google" ? (
        <GoogleIcon />
      ) : (
        <FacebookIcon />
      )}
      {label}
    </button>
  );
}

export function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function Field({
  label, labelRight, error, children,
}: {
  label: string;
  labelRight?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {labelRight}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function PasswordInput({
  placeholder, value, onChange, show, onToggle, hasError, extraClass = "",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  hasError: boolean;
  extraClass?: string;
}) {
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("pr-10", hasError ? "border-destructive" : "", extraClass)}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export function Spinner({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />;
}

export function clearErr(
  setter: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  key: string,
) {
  setter((p) => { const n = { ...p }; delete n[key]; return n; });
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}
