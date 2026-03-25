"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Car, Menu, User, Plus, X, Settings, LogOut, ChevronDown, LayoutDashboard, MessageSquare, ClipboardList } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/translations";

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "lt", flag: "🇱🇹", label: "LT" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useMockAuth();
  const { openLogin, openRegister } = useAuthModal();
  const { lang, setLang, t } = useLanguage();

  const [isScrolled,      setIsScrolled]      = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [userMenuOpen,    setUserMenuOpen]    = useState(false);
  const [langMenuOpen,    setLangMenuOpen]    = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setLangMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [{ href: "/listings", label: t.nav.browse }];
  if (isAuthenticated) {
    navLinks.push(
      { href: "/my-listings",  label: t.nav.myListings  },
      { href: "/my-inquiries", label: t.nav.myInquiries },
      { href: "/messages",     label: t.nav.messages    },
    );
  }

  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "";
  const currentLang = LANGS.find((l) => l.code === lang)!;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled || mobileMenuOpen ? "glass py-2.5" : "bg-transparent py-4",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:opacity-85 transition-opacity">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              AutoMarket
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-border">
              {/* Language switcher */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangMenuOpen((v) => !v)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold transition-colors",
                    langMenuOpen ? "bg-muted" : "hover:bg-muted",
                  )}
                >
                  <span>{currentLang.flag}</span>
                  <span className="text-foreground">{currentLang.label}</span>
                  <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", langMenuOpen && "rotate-180")} />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                          lang === l.code ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted",
                        )}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                        {lang === l.code && <span className="ml-auto text-primary text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <>
                  <Link href="/post">
                    <Button size="sm" className="gap-2 shadow-sm shadow-primary/20 font-semibold">
                      <Plus className="w-4 h-4" />
                      {t.nav.postAd}
                    </Button>
                  </Link>

                  {/* User dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors",
                        userMenuOpen ? "bg-muted" : "hover:bg-muted",
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center overflow-hidden text-xs font-bold text-primary">
                        {user?.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          initials || <User className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{user?.firstName}</span>
                      <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", userMenuOpen && "rotate-180")} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 card-shadow-lg">
                        <div className="px-4 py-3 border-b border-border bg-muted/40">
                          <p className="text-sm font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">@{user?.username}</p>
                        </div>
                        <div className="p-1.5">
                          <Link href="/my-listings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />{t.nav.myListings}
                          </Link>
                          <Link href="/my-inquiries" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                            <ClipboardList className="w-4 h-4 text-muted-foreground" />{t.nav.myInquiries}
                          </Link>
                          <Link href="/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />{t.nav.messages}
                          </Link>
                          <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                            <Settings className="w-4 h-4 text-muted-foreground" />{t.nav.accountSettings}
                          </Link>
                          <div className="h-px bg-border my-1" />
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />{t.nav.signOut}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="font-semibold" onClick={openLogin}>
                    {t.nav.logIn}
                  </Button>
                  <Button size="sm" className="font-semibold shadow-sm shadow-primary/20" onClick={openRegister}>
                    {t.nav.signUp}
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border mt-2.5 bg-background/98 backdrop-blur-xl">
          <div className="px-4 pt-3 pb-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-border my-2" />

            {/* Mobile language switcher */}
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Language</p>
              <div className="flex gap-2">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors",
                      lang === l.code
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:bg-muted",
                    )}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border my-2" />

            {isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-4 py-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-sm font-bold text-primary overflow-hidden">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      initials || <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username}</p>
                  </div>
                </div>
                <Link href="/post" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" /> {t.nav.postAd}
                </Link>
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                  <Settings className="w-4 h-4 text-muted-foreground" /> {t.nav.accountSettings}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> {t.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="px-2 flex flex-col gap-2">
                <Button variant="outline" className="w-full font-semibold" onClick={() => { setMobileMenuOpen(false); openLogin(); }}>
                  {t.nav.logIn}
                </Button>
                <Button className="w-full font-semibold" onClick={() => { setMobileMenuOpen(false); openRegister(); }}>
                  {t.nav.signUp}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
