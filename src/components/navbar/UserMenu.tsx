"use client";

import Link from "next/link";
import { User, ChevronDown, LayoutDashboard, MessageSquare, Heart, Settings, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MockUser } from "@/lib/mock-data";

export function UserMenu({
  user,
  initials,
  isOpen,
  setOpen,
  logout,
  t,
  menuRef,
}: {
  user: MockUser | null;
  initials: string;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  logout: () => void;
  t: { nav: { myListings: string; messages: string; accountSettings: string; signOut: string; postAd: string } };
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <Link href="/post">
        <Button size="sm" className="gap-2 shadow-sm shadow-primary/20 font-semibold">
          <Plus className="w-4 h-4" />
          {t.nav.postAd}
        </Button>
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors",
            isOpen ? "bg-muted" : "hover:bg-muted",
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
          <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 card-shadow-lg">
            <div className="px-4 py-3 border-b border-border bg-muted/40">
              <p className="text-sm font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">@{user?.username}</p>
            </div>
            <div className="p-1.5">
              <Link href="/my-listings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />{t.nav.myListings}
              </Link>
              <Link href="/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />{t.nav.messages}
              </Link>
              <Link href="/saved" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                <Heart className="w-4 h-4 text-muted-foreground" />Saved Vehicles
              </Link>
              <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />{t.nav.accountSettings}
              </Link>
              <div className="h-px bg-border my-1" />
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors">
                <LogOut className="w-4 h-4" />{t.nav.signOut}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
