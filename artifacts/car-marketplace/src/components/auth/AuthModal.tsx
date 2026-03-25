"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number",            test: (p: string) => /\d/.test(p) },
];

export function AuthModal() {
  const { isOpen, tab, close, switchTab } = useAuthModal();
  const { login } = useMockAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* lock body scroll while open */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else        document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
      />

      {/* modal card */}
      <div className="relative w-full max-w-md bg-background rounded-3xl shadow-2xl overflow-hidden">
        {/* close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* tab bar */}
        <div className="flex border-b border-border">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={cn(
                "flex-1 py-4 text-sm font-semibold transition-colors relative",
                tab === t
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "login" ? "Log In" : "Sign Up"}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="px-7 py-6 overflow-y-auto max-h-[80vh] styled-scrollbar">
          {tab === "login" ? (
            <LoginForm onSuccess={close} login={login} switchTab={() => switchTab("register")} />
          ) : (
            <RegisterForm onSuccess={close} login={login} switchTab={() => switchTab("login")} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ────────────────────────────────────────────────────────── */
/*  LOGIN FORM                                                */
/* ────────────────────────────────────────────────────────── */
function LoginForm({
  onSuccess,
  login,
  switchTab,
}: {
  onSuccess: () => void;
  login: () => void;
  switchTab: () => void;
}) {
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [isLoading,  setIsLoading]  = useState(false);
  const [socialLoad, setSocialLoad] = useState<"google" | "facebook" | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim())                    e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Enter a valid email address.";
    if (!password)                        e.password = "Password is required.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => { login(); onSuccess(); }, 800);
  };

  const handleSocial = (provider: "google" | "facebook") => {
    setSocialLoad(provider);
    setTimeout(() => { login(); onSuccess(); }, 900);
  };

  const busy = isLoading || socialLoad !== null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Sign in to continue to AutoMarket.</p>
      </div>

      {/* social */}
      <div className="flex flex-col gap-2.5">
        <SocialButton provider="google"   loading={socialLoad === "google"}   disabled={busy} onClick={() => handleSocial("google")}   label="Continue with Google"   />
        <SocialButton provider="facebook" loading={socialLoad === "facebook"} disabled={busy} onClick={() => handleSocial("facebook")} label="Continue with Facebook" />
      </div>

      <Divider text="or continue with email" />

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Email address"
          error={errors.email}
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearErr(setErrors, "email"); }}
            className={errors.email ? "border-destructive" : ""}
          />
        </Field>

        <Field
          label="Password"
          labelRight={<button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>}
          error={errors.password}
        >
          <PasswordInput
            placeholder="Enter your password"
            value={password}
            onChange={(v) => { setPassword(v); clearErr(setErrors, "password"); }}
            show={showPass}
            onToggle={() => setShowPass((s) => !s)}
            hasError={!!errors.password}
          />
        </Field>

        <Button type="submit" className="w-full gap-2" disabled={busy}>
          <Spinner show={isLoading} />
          {!isLoading && <ArrowRight className="w-4 h-4" />}
          {isLoading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button onClick={switchTab} className="text-primary font-semibold hover:underline">
          Create one
        </button>
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  REGISTER FORM                                             */
/* ────────────────────────────────────────────────────────── */
function RegisterForm({
  onSuccess,
  login,
  switchTab,
}: {
  onSuccess: () => void;
  login: () => void;
  switchTab: () => void;
}) {
  const [firstName,  setFirstName]  = useState("");
  const [lastName,   setLastName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [isLoading,  setIsLoading]  = useState(false);
  const [socialLoad, setSocialLoad] = useState<"google" | "facebook" | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim())                e.firstName = "Required.";
    if (!lastName.trim())                 e.lastName  = "Required.";
    if (!email.trim())                    e.email     = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email     = "Enter a valid email address.";
    if (!password)                        e.password  = "Password is required.";
    else if (password.length < 8)         e.password  = "At least 8 characters.";
    if (!confirm)                         e.confirm   = "Please confirm your password.";
    else if (confirm !== password)        e.confirm   = "Passwords do not match.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => { login(); onSuccess(); }, 900);
  };

  const handleSocial = (provider: "google" | "facebook") => {
    setSocialLoad(provider);
    setTimeout(() => { login(); onSuccess(); }, 900);
  };

  const passwordStrength = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const busy = isLoading || socialLoad !== null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">Create your account</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Join AutoMarket — free to get started.</p>
      </div>

      {/* social */}
      <div className="flex flex-col gap-2.5">
        <SocialButton provider="google"   loading={socialLoad === "google"}   disabled={busy} onClick={() => handleSocial("google")}   label="Sign up with Google"   />
        <SocialButton provider="facebook" loading={socialLoad === "facebook"} disabled={busy} onClick={() => handleSocial("facebook")} label="Sign up with Facebook" />
      </div>

      <Divider text="or sign up with email" />

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name row */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" error={errors.firstName}>
            <Input
              placeholder="John"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); clearErr(setErrors, "firstName"); }}
              className={errors.firstName ? "border-destructive" : ""}
            />
          </Field>
          <Field label="Last name" error={errors.lastName}>
            <Input
              placeholder="Doe"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); clearErr(setErrors, "lastName"); }}
              className={errors.lastName ? "border-destructive" : ""}
            />
          </Field>
        </div>

        <Field label="Email address" error={errors.email}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearErr(setErrors, "email"); }}
            className={errors.email ? "border-destructive" : ""}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <PasswordInput
            placeholder="Create a strong password"
            value={password}
            onChange={(v) => { setPassword(v); clearErr(setErrors, "password"); }}
            show={showPass}
            onToggle={() => setShowPass((s) => !s)}
            hasError={!!errors.password}
          />
          {/* strength */}
          {password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < passwordStrength
                        ? passwordStrength === 1 ? "bg-red-400" : passwordStrength === 2 ? "bg-amber-400" : "bg-emerald-500"
                        : "bg-border",
                    )}
                  />
                ))}
              </div>
              <ul className="space-y-0.5">
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(password);
                  return (
                    <li key={r.label} className={cn("flex items-center gap-1.5 text-xs transition-colors", ok ? "text-emerald-600" : "text-muted-foreground")}>
                      <Check className={cn("w-3 h-3 shrink-0", ok ? "opacity-100" : "opacity-0")} />
                      {r.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Field>

        <Field label="Confirm password" error={errors.confirm}>
          <PasswordInput
            placeholder="Repeat your password"
            value={confirm}
            onChange={(v) => { setConfirm(v); clearErr(setErrors, "confirm"); }}
            show={showConf}
            onToggle={() => setShowConf((s) => !s)}
            hasError={!!errors.confirm}
            extraClass={!errors.confirm && confirm && confirm === password ? "border-emerald-500" : ""}
          />
          {!errors.confirm && confirm && confirm === password && (
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <Check className="w-3 h-3" /> Passwords match
            </p>
          )}
        </Field>

        <p className="text-xs text-muted-foreground">
          By creating an account you agree to our{" "}
          <a href="/terms"   className="text-primary hover:underline">Terms</a> and{" "}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>

        <Button type="submit" className="w-full gap-2" disabled={busy}>
          <Spinner show={isLoading} />
          {!isLoading && <ArrowRight className="w-4 h-4" />}
          {isLoading ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button onClick={switchTab} className="text-primary font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  SHARED SUB-COMPONENTS                                     */
/* ────────────────────────────────────────────────────────── */
function SocialButton({
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

function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function Field({
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

function PasswordInput({
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

function Spinner({ show }: { show: boolean }) {
  if (!show) return null;
  return <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />;
}

function clearErr(setter: React.Dispatch<React.SetStateAction<Record<string, string>>>, key: string) {
  setter((p) => { const n = { ...p }; delete n[key]; return n; });
}

/* ── brand SVG icons ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}
