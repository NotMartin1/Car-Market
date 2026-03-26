"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SocialButton, Divider, Field, PasswordInput, Spinner } from "./auth-shared";

const PASSWORD_TESTS = [
  (p: string) => p.length >= 8,
  (p: string) => /[A-Z]/.test(p),
  (p: string) => /\d/.test(p),
];

const schema = z.object({
  firstName:       z.string().min(1, "Required."),
  lastName:        z.string().min(1, "Required."),
  email:           z.string().email("Enter a valid email address."),
  password:        z.string().min(8, "At least 8 characters."),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

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
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [socialLoad, setSocialLoad] = useState<"google" | "facebook" | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const password = watch("password") ?? "";
  const confirmPassword = watch("confirmPassword") ?? "";

  const onSubmit = async (_data: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    login();
    onSuccess();
  };

  const handleSocial = (provider: "google" | "facebook") => {
    setSocialLoad(provider);
    setTimeout(() => { login(); onSuccess(); }, 900);
  };

  const passwordStrength = PASSWORD_TESTS.filter((fn) => fn(password)).length;
  const busy = isSubmitting || socialLoad !== null;

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label={a.firstName} error={errors.firstName?.message}>
            <Input
              placeholder="John"
              className={errors.firstName ? "border-destructive" : ""}
              {...register("firstName")}
            />
          </Field>
          <Field label={a.lastName} error={errors.lastName?.message}>
            <Input
              placeholder="Doe"
              className={errors.lastName ? "border-destructive" : ""}
              {...register("lastName")}
            />
          </Field>
        </div>

        <Field label={a.email} error={errors.email?.message}>
          <Input
            type="email"
            placeholder={a.emailPlaceholder}
            className={errors.email ? "border-destructive" : ""}
            {...register("email")}
          />
        </Field>

        <Field label={a.password} error={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                placeholder={a.passwordCreate}
                value={field.value ?? ""}
                onChange={field.onChange}
                show={showPass}
                onToggle={() => setShowPass((s) => !s)}
                hasError={!!errors.password}
              />
            )}
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

        <Field label={a.confirmPassword} error={errors.confirmPassword?.message}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                placeholder={a.passwordRepeat}
                value={field.value ?? ""}
                onChange={field.onChange}
                show={showConf}
                onToggle={() => setShowConf((s) => !s)}
                hasError={!!errors.confirmPassword}
                extraClass={!errors.confirmPassword && confirmPassword && confirmPassword === password ? "border-emerald-500" : ""}
              />
            )}
          />
          {!errors.confirmPassword && confirmPassword && confirmPassword === password && (
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
          <Spinner show={isSubmitting} />
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          {isSubmitting ? a.creatingAccount : a.createAccount}
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
