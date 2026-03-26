"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialButton, Divider, Field, PasswordInput, Spinner, clearErr } from "./auth-shared";

type AuthStrings = {
  loginTitle: string;
  loginSubtext: string;
  withGoogle: string;
  withFacebook: string;
  orEmail: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  signingIn: string;
  signIn: string;
  noAccount: string;
  createOne: string;
};

export function LoginForm({
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
        <h2 className="font-display font-bold text-xl text-foreground">{a.loginTitle}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{a.loginSubtext}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <SocialButton provider="google"   loading={socialLoad === "google"}   disabled={busy} onClick={() => handleSocial("google")}   label={a.withGoogle}   />
        <SocialButton provider="facebook" loading={socialLoad === "facebook"} disabled={busy} onClick={() => handleSocial("facebook")} label={a.withFacebook} />
      </div>

      <Divider text={a.orEmail} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={a.email} error={errors.email}>
          <Input
            type="email"
            placeholder={a.emailPlaceholder}
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearErr(setErrors, "email"); }}
            className={errors.email ? "border-destructive" : ""}
          />
        </Field>

        <Field
          label={a.password}
          labelRight={<button type="button" className="text-xs text-primary hover:underline">{a.forgotPassword}</button>}
          error={errors.password}
        >
          <PasswordInput
            placeholder={a.passwordPlaceholder}
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
          {isLoading ? a.signingIn : a.signIn}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {a.noAccount}{" "}
        <button onClick={switchTab} className="text-primary font-semibold hover:underline">
          {a.createOne}
        </button>
      </p>
    </div>
  );
}
