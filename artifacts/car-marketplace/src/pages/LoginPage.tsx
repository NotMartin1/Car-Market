"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useMockAuth();

  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [isLoading,   setIsLoading]   = useState(false);
  const [socialLoad,  setSocialLoad]  = useState<"google" | "facebook" | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim())           e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address.";
    if (!password)               e.password = "Password is required.";
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
    }, 800);
  };

  const handleSocial = (provider: "google" | "facebook") => {
    setSocialLoad(provider);
    setTimeout(() => {
      login();
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── left hero panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-foreground px-12 py-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Car className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-white">AutoMarket</span>
        </Link>

        <div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-4">
            Your next<br />
            <span className="text-primary">dream vehicle</span><br />
            is one click away.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Join thousands of buyers and sellers on AutoMarket — the most trusted used vehicle marketplace.
          </p>
        </div>

        <p className="text-white/25 text-xs">© {new Date().getFullYear()} AutoMarket. All rights reserved.</p>
      </div>

      {/* ── right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
        {/* mobile logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Car className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">AutoMarket</span>
        </Link>

        <div className="w-full max-w-md">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your account to continue.</p>

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
              Continue with Google
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
              Continue with Facebook
            </button>
          </div>

          {/* divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                className={errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
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
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading || socialLoad !== null}>
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isLoading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── icon components ── */
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
