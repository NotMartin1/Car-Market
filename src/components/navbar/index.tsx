"use client";

import { usePathname } from "next/navigation";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useLanguage } from "@/contexts/language-context";
import { useDarkMode } from "@/contexts/dark-mode-context";
import { useNotifications } from "@/contexts/notifications-context";
import { useSaved } from "@/contexts/saved-context";
import { useCompare } from "@/contexts/compare-context";
import { Button } from "@/components/ui/button";
import { Heart, GitCompare, Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useMockAuth();
  const { openLogin, openRegister } = useAuthModal();
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const { savedIds } = useSaved();
  const { ids: compareIds } = useCompare();

  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);
  const [langMenuOpen,   setLangMenuOpen]   = useState(false);
  const [notifOpen,      setNotifOpen]      = useState(false);

  const userMenuRef  = useRef<HTMLDivElement>(null);
  const langMenuRef  = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setLangMenuOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current  && !userMenuRef.current.contains(e.target as Node))  setUserMenuOpen(false);
      if (langMenuRef.current  && !langMenuRef.current.contains(e.target as Node))  setLangMenuOpen(false);
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [{ href: "/listings", label: t.nav.browse }];
  if (isAuthenticated) {
    navLinks.push(
      { href: "/my-listings", label: t.nav.myListings },
      { href: "/messages",    label: t.nav.messages   },
    );
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled || mobileMenuOpen ? "glass py-2.5" : "bg-transparent py-4",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          <NavLogo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <NavLinks links={navLinks} pathname={pathname ?? ""} />

            <div className="flex items-center gap-1.5 pl-4 border-l border-border">

              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <LanguageSwitcher
                lang={lang}
                setLang={setLang}
                isOpen={langMenuOpen}
                setOpen={setLangMenuOpen}
                menuRef={langMenuRef}
              />

              {/* Compare button */}
              {compareIds.length > 0 && (
                <Link
                  href="/compare"
                  className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors border border-primary/20"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Compare ({compareIds.length})
                </Link>
              )}

              {/* Saved */}
              {isAuthenticated && (
                <Link
                  href="/saved"
                  title="Saved vehicles"
                  className={cn(
                    "relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors",
                    pathname === "/saved" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Heart className="w-4 h-4" />
                  {savedIds.size > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {savedIds.size > 9 ? "9+" : savedIds.size}
                    </span>
                  )}
                </Link>
              )}

              {/* Notification bell */}
              {isAuthenticated && (
                <NotificationBell
                  notifications={notifications}
                  unreadCount={unreadCount}
                  markRead={markRead}
                  markAllRead={markAllRead}
                  isOpen={notifOpen}
                  setOpen={setNotifOpen}
                  menuRef={notifMenuRef}
                />
              )}

              {isAuthenticated ? (
                <UserMenu
                  user={user}
                  initials={initials}
                  isOpen={userMenuOpen}
                  setOpen={setUserMenuOpen}
                  logout={logout}
                  t={t}
                  menuRef={userMenuRef}
                />
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

      <MobileMenu
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        pathname={pathname ?? ""}
        isAuthenticated={isAuthenticated}
        user={user}
        initials={initials}
        unreadCount={unreadCount}
        savedCount={savedIds.size}
        compareCount={compareIds.length}
        lang={lang}
        setLang={setLang}
        isDark={isDark}
        toggleDark={toggleDark}
        logout={logout}
        openLogin={openLogin}
        openRegister={openRegister}
        onClose={() => setMobileMenuOpen(false)}
        t={t}
      />
    </header>
  );
}
