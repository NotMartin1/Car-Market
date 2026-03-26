"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SocialButton, Divider, Field, PasswordInput, Spinner, clearErr } from "./auth-shared";

const PASSWORD_TESTS = [
  (p: string) => p.length >= 8,
  (p: string) => /[A-Z]/.test(p),
  (p: string) => /\d/.test(p),
];

type AuthStrings = {
  registerTitle: string;
  registerSubtext: string;
  signUpGoogle: string;
  signUpFacebook: string;
  orEmailReg: string;
  firstName: string;
  lastName: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordCreate: string;
  confirmPassword: string;
  passwordRepeat: string;
  rule8chars: string;
  ruleUppercase: string;
  ruleNumber: string;
  passwordsMatch: string;
  termsAgree: string;
  terms: string;
  and: string;
  privacy: string;
  creatingAccount: string;
  createAccount: string;
  haveAccount: string;
  signInLink: string;
};

export function RegisterForm({
  a,
  onSuccess,
  login,
  switchTab,
}: {
  a: AuthStrings;
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

  const passwordStrength = PASSWORD_TESTS.filter((fn) => fn(password)).length;
  const busy = isLoading || socialLoad !== null;

  const passwordRules = [
    { label: a.rule8chars,    ok: PASSWORD_TESTS[0](password) },
    { label: a.ruleUppercase, ok: PASSWORD_TESTS[1](password) },
    { label: a.ruleNumber,    ok: PASSWORD_TESTS[2](password) },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">{a.registerTitle}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{a.registerSubtext}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <SocialButton provider="google"   loading={socialLoad === "google"}   disabled={busy} onClick={() => handleSocial("google")}   label={a.signUpGoogle}   />
        <SocialButton provider="facebook" loading={socialLoad === "facebook"} disabled={busy} onClick={() => handleSocial("facebook")} label={a.signUpFacebook} />
      </div>

      <Divider text={a.orEmailReg} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label={a.firstName} error={errors.firstName}>
            <Input
              placeholder="John"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); clearErr(setErrors, "firstName"); }}
              className={errors.firstName ? "border-destructive" : ""}
            />
          </Field>
          <Field label={a.lastName} error={errors.lastName}>
            <Input
              placeholder="Doe"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); clearErr(setErrors, "lastName"); }}
              className={errors.lastName ? "border-destructive" : ""}
            />
          </Field>
        </div>

        <Field label={a.email} error={errors.email}>
          <Input
            type="email"
            placeholder={a.emailPlaceholder}
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearErr(setErrors, "email"); }}
            className={errors.email ? "border-destructive" : ""}
          />
        </Field>

        <Field label={a.password} error={errors.password}>
          <PasswordInput
            placeholder={a.passwordCreate}
            value={password}
            onChange={(v) => { setPassword(v); clearErr(setErrors, "password"); }}
            show={showPass}
            onToggle={() => setShowPass((s) => !s)}
            hasError={!!errors.password}
          />
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
                {passwordRules.map((r) => (
                  <li key={r.label} className={cn("flex items-center gap-1.5 text-xs transition-colors", r.ok ? "text-emerald-600" : "text-muted-foreground")}>
                    <Check className={cn("w-3 h-3 shrink-0", r.ok ? "opacity-100" : "opacity-0")} />
                    {r.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Field>

        <Field label={a.confirmPassword} error={errors.confirm}>
          <PasswordInput
            placeholder={a.passwordRepeat}
            value={confirm}
            onChange={(v) => { setConfirm(v); clearErr(setErrors, "confirm"); }}
            show={showConf}
            onToggle={() => setShowConf((s) => !s)}
            hasError={!!errors.confirm}
            extraClass={!errors.confirm && confirm && confirm === password ? "border-emerald-500" : ""}
          />
          {!errors.confirm && confirm && confirm === password && (
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <Check className="w-3 h-3" /> {a.passwordsMatch}
            </p>
          )}
        </Field>

        <p className="text-xs text-muted-foreground">
          {a.termsAgree}{" "}
          <a href="/terms"   className="text-primary hover:underline">{a.terms}</a> {a.and}{" "}
          <a href="/privacy" className="text-primary hover:underline">{a.privacy}</a>.
        </p>

        <Button type="submit" className="w-full gap-2" disabled={busy}>
          <Spinner show={isLoading} />
          {!isLoading && <ArrowRight className="w-4 h-4" />}
          {isLoading ? a.creatingAccount : a.createAccount}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {a.haveAccount}{" "}
        <button onClick={switchTab} className="text-primary font-semibold hover:underline">
          {a.signInLink}
        </button>
      </p>
    </div>
  );
}
