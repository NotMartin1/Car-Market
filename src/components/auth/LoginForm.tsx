"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialButton, Divider, Field, PasswordInput, Spinner } from "./auth-shared";

const schema = z.object({
  email:    z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof schema>;

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
  const [showPass,   setShowPass]   = useState(false);
  const [socialLoad, setSocialLoad] = useState<"google" | "facebook" | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    login();
    onSuccess();
  };

  const handleSocial = (provider: "google" | "facebook") => {
    setSocialLoad(provider);
    setTimeout(() => { login(); onSuccess(); }, 900);
  };

  const busy = isSubmitting || socialLoad !== null;

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label={a.email} error={errors.email?.message}>
          <Input
            type="email"
            placeholder={a.emailPlaceholder}
            className={errors.email ? "border-destructive" : ""}
            {...register("email")}
          />
        </Field>

        <Field
          label={a.password}
          labelRight={<button type="button" className="text-xs text-primary hover:underline">{a.forgotPassword}</button>}
          error={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                placeholder={a.passwordPlaceholder}
                value={field.value ?? ""}
                onChange={field.onChange}
                show={showPass}
                onToggle={() => setShowPass((s) => !s)}
                hasError={!!errors.password}
              />
            )}
          />
        </Field>

        <Button type="submit" className="w-full gap-2" disabled={busy}>
          <Spinner show={isSubmitting} />
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          {isSubmitting ? a.signingIn : a.signIn}
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
