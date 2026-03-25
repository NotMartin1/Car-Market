"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { Car, Menu, User, Plus, X, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = usePathname();
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/listings", label: "Browse Vehicles" },
  ];

  if (isAuthenticated) {
    navLinks.push(
      { href: "/my-listings", label: "My Listings" },
      { href: "/my-inquiries", label: "My Inquiries" },
      { href: "/messages", label: "Messages" }
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled || mobileMenuOpen ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:bg-accent transition-colors">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-accent transition-colors">
              AutoMarket
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent",
                    location === link.href ? "text-accent" : "text-foreground/80"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-20 h-10 bg-muted animate-pulse rounded-xl" />
              ) : isAuthenticated ? (
                <>
                  <Link href="/post">
                    <Button variant="outline" className="gap-2 border-accent/20 hover:border-accent text-accent">
                      <Plus className="w-4 h-4" />
                      Post Ad
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={login} className="font-semibold shadow-lg shadow-primary/20">
                  Sign In
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border mt-3"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-medium",
                    location === link.href ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-border my-2" />
              
              {isAuthenticated ? (
                <div className="flex flex-col gap-3 px-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    </div>
                  </div>
                  <Link href="/post">
                    <Button className="w-full justify-start gap-2">
                      <Plus className="w-4 h-4" /> Post a Listing
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={logout} className="w-full justify-start text-destructive hover:text-destructive">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="px-2">
                  <Button onClick={login} className="w-full">Sign In / Register</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
