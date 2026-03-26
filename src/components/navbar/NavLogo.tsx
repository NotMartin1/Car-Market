"use client";

import Link from "next/link";
import { Car } from "lucide-react";

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:opacity-85 transition-opacity">
        <Car className="w-5 h-5" />
      </div>
      <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
        AutoMarket
      </span>
    </Link>
  );
}
