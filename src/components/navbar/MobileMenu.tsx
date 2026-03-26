"use client";

import Link from "next/link";
import { User, Plus, Settings, LogOut, Bell, Heart, GitCompare, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LANGS } from "./LanguageSwitcher";
import type { Lang } from "@/lib/translations";
import type { MockUser } from "@/lib/mock-data";

interface NavLink {
  href: string;
  label: string;
}

export function MobileMenu({
  isOpen,
  navLinks,
  pathname,
  isAuthenticated,
  user,
  initials,
  unreadCount,
  savedCount,
  compareCount,
  lang,
  setLang,
  isDark,
  toggleDark,
  logout,
  openLogin,
  openRegister,
  onClose,
  t,
}: {
  isOpen: boolean;
  navLinks: NavLink[];
  pathname: string;
  isAuthenticated: boolean;
  user: MockUser | null;
  initials: string;
  unreadCount: number;
  savedCount: number;
  compareCount: number;
  lang: Lang;
  setLang: (l: Lang) => void;
  isDark: boolean;
  toggleDark: () => void;
  logout: () => void;
  openLogin: () => void;
  openRegister: () => void;
  onClose: () => void;
  t: { nav: { postAd: string; accountSettings: string; signOut: string; logIn: string; signUp: string } };
}) {
  if (!isOpen) return null;

  return (
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

        {isAuthenticated && (
          <Link
            href="/saved"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
              pathname === "/saved" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
            )}
          >
            <Heart className="w-4 h-4" />
            Saved Vehicles
            {savedCount > 0 && (
              <span className="ml-auto text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </Link>
        )}

        {compareCount > 0 && (
          <Link href="/compare" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary bg-primary/10 transition-colors">
            <GitCompare className="w-4 h-4" /> Compare ({compareCount})
          </Link>
        )}

        <div className="h-px bg-border my-2" />

        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors",
                  lang === l.code ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted",
                )}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="h-px bg-border my-2" />

        {isAuthenticated ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 px-4 py-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-sm font-bold text-primary overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user?.username} className="w-full h-full object-cover" />
                ) : (
                  initials || <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">@{user?.username}</p>
              </div>
              {unreadCount > 0 && (
                <Link href="/messages" onClick={onClose} className="ml-auto relative">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                </Link>
              )}
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
            <Button
              variant="outline"
              className="w-full font-semibold"
              onClick={() => { onClose(); openLogin(); }}
            >
              {t.nav.logIn}
            </Button>
            <Button
              className="w-full font-semibold"
              onClick={() => { onClose(); openRegister(); }}
            >
              {t.nav.signUp}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
