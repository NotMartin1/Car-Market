"use client";

import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { useRouter } from "next/navigation";
import { Car, Bell, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProfileForm } from "@/components/account/ProfileForm";
import { NotificationSettings } from "@/components/account/NotificationSettings";
import { SecuritySettings } from "@/components/account/SecuritySettings";

export default function AccountPage() {
  const { user, isAuthenticated, updateUser, logout } = useMockAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-foreground text-background pt-28 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Account Settings</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Account Settings</h1>
          <p className="text-white/50">Manage your profile, preferences, and security.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: "/my-listings", icon: Car,  label: "My Listings" },
            { href: "/messages",    icon: Bell, label: "Messages"    },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-md transition-all card-shadow group"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-semibold text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </Link>
          ))}
        </div>

        <ProfileForm user={user} onSave={updateUser} />

        <NotificationSettings />

        <SecuritySettings />

        {/* Danger zone */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-foreground mb-2 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-destructive" />
            Sign Out
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            You will be signed out of your account on this device. Your listings and messages will remain intact.
          </p>
          <Button
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            onClick={() => { logout(); router.push("/"); }}
          >
            Sign Out of AutoMarket
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
