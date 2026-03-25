"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { Button } from "@/components/ui/button";
import { Car, Menu, User, Plus, X, Settings, LogOut, ChevronDown, LayoutDashboard, MessageSquare, ClipboardList } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/contexts/auth-modal-context";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useMockAuth();
  const { openLogin, openRegister } = useAuthModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [{ href: "/listings", label: "Browse Vehicles" }];

  if (isAuthenticated) {
    navLinks.push(
      { href: "/my-listings", label: "My Listings" },
      { href: "/my-inquiries", label: "My Inquiries" },
      { href: "/messages", label: "Messages" },
    );
  }

  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "";

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
          <nav className="hidden md:flex items-center gap-6">
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
              {isAuthenticated ? (
                <>
                  <Link href="/post">
                    <Button size="sm" className="gap-2 shadow-sm shadow-primary/20 font-semibold">
                      <Plus className="w-4 h-4" />
                      Post Ad
                    </Button>
                  </Link>

                  {/* User menu dropdown */}
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
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                            My Listings
                          </Link>
                          <Link href="/my-inquiries" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                            <ClipboardList className="w-4 h-4 text-muted-foreground" />
                            My Inquiries
                          </Link>
                          <Link href="/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            Messages
                          </Link>
                          <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Account Settings
                          </Link>
                          <div className="h-px bg-border my-1" />
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="font-semibold" onClick={openLogin}>
                    Log In
                  </Button>
                  <Button size="sm" className="font-semibold shadow-sm shadow-primary/20" onClick={openRegister}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
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
                  <Plus className="w-4 h-4" /> Post a Listing
                </Link>
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                  <Settings className="w-4 h-4 text-muted-foreground" /> Account Settings
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="px-2 flex flex-col gap-2">
                <Button variant="outline" className="w-full font-semibold" onClick={() => { setMobileMenuOpen(false); openLogin(); }}>
                  Log In
                </Button>
                <Button className="w-full font-semibold" onClick={() => { setMobileMenuOpen(false); openRegister(); }}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
