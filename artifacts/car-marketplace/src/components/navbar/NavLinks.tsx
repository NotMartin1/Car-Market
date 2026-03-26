"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

export function NavLinks({
  links,
  pathname,
}: {
  links: NavLink[];
  pathname: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {links.map((link) => (
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
  );
}
