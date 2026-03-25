"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PASSWORD_RULES = [
  { label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",   test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number",             test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router  = useRouter();
  const { login } = useMockAuth();

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
    if (!firstName.trim())          e.firstName = "First name is required.";
    if (!lastName.trim())           e.lastName  = "Last name is required.";
    if (!email.trim())              e.email     = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address.";
    if (!password)                  e.password  = "Password is required.";
    else if (password.length < 8)   e.password  = "Password must be at least 8 characters.";
    if (!confirm)                   e.confirm   = "Please confirm your password.";
    else if (confirm !== password)  e.confirm   = "Passwords do not match.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      login();
      router.push("/");
    }, 900);
  };

  const handleSocial = (provider: "google" | "facebook") => {
    setSocialLoad(provider);
    setTimeout(() => {
      login();
      router.push("/");
    }, 1000);
  };

  const passwordStrength = PASSWORD_RULES.filter((r) => r.test(password)).length;

  return (
    <div className="min-h-screen flex">
      {/* ── left hero panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-foreground px-12 py-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Car className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-white">AutoMarket</span>
        </Link>

        <div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-4">
            Buy and sell<br />
            vehicles with<br />
            <span className="text-primary">confidence.</span>
          </h2>
          <ul className="space-y-3 mt-6">
            {["Free to list your vehicle", "Thousands of verified buyers", "Secure messaging & inquiries"].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-white/60 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/25 text-xs">© {new Date().getFullYear()} AutoMarket. All rights reserved.</p>
      </div>

      {/* ── right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        {/* mobile logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Car className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">AutoMarket</span>
        </Link>

        <div className="w-full max-w-md">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Create your account</h1>
          <p className="text-muted-foreground text-sm mb-8">Join AutoMarket — it&apos;s free to get started.</p>

          {/* social buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleSocial("google")}
              disabled={isLoading || socialLoad !== null}
              className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-[#dadce0] rounded-xl text-sm font-medium text-[#3c4043] hover:bg-[#f8f9fa] transition-colors disabled:opacity-60 shadow-sm"
            >
              {socialLoad === "google" ? (
                <span className="w-4 h-4 border-2 border-[#3c4043]/30 border-t-[#3c4043] rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Sign up with Google
            </button>

            <button
              onClick={() => handleSocial("facebook")}
              disabled={isLoading || socialLoad !== null}
              className="w-full h-11 flex items-center justify-center gap-3 bg-[#1877f2] rounded-xl text-sm font-medium text-white hover:bg-[#166fe5] transition-colors disabled:opacity-60 shadow-sm"
            >
              {socialLoad === "facebook" ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FacebookIcon />
              )}
              Sign up with Facebook
            </button>
          </div>

          {/* divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or sign up with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">First name</label>
                <Input
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }}
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Last name</label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: "" })); }}
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            {/* email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}

              {/* strength bar + rules */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength
                            ? passwordStrength === 1 ? "bg-red-400"
                            : passwordStrength === 2 ? "bg-amber-400"
                            : "bg-emerald-500"
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="space-y-1">
                    {PASSWORD_RULES.map((r) => {
                      const ok = r.test(password);
                      return (
                        <li key={r.label} className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-emerald-600" : "text-muted-foreground"}`}>
                          <Check className={`w-3 h-3 ${ok ? "opacity-100" : "opacity-0"}`} />
                          {r.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* confirm */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm password</label>
              <div className="relative">
                <Input
                  type={showConf ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                  className={`pr-10 ${errors.confirm ? "border-destructive" : confirm && confirm === password ? "border-emerald-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConf((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
              {!errors.confirm && confirm && confirm === password && (
                <p className="text-xs text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</p>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full gap-2" disabled={isLoading || socialLoad !== null}>
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isLoading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}
