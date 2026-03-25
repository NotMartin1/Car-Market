"use client";

import { Car } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="bg-primary/90 text-primary-foreground p-2 rounded-xl">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">AutoMarket</span>
            </div>
            <p className="text-white/55 max-w-sm leading-relaxed text-sm">{f.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-white text-sm uppercase tracking-wider">{f.quickLinks}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/listings"   className="text-white/75 hover:text-primary transition-colors">{f.browseVehicles}</Link></li>
              <li><Link href="/post"        className="text-white/75 hover:text-primary transition-colors">{f.sellVehicle}</Link></li>
              <li><Link href="/my-listings" className="text-white/75 hover:text-primary transition-colors">{f.myListings}</Link></li>
              <li><Link href="/messages"    className="text-white/75 hover:text-primary transition-colors">{f.messages}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-white text-sm uppercase tracking-wider">{f.legal}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/terms"    className="text-white/75 hover:text-primary transition-colors">{f.terms}</Link></li>
              <li><Link href="/privacy"  className="text-white/75 hover:text-primary transition-colors">{f.privacy}</Link></li>
              <li><Link href="/cookies"  className="text-white/75 hover:text-primary transition-colors">{f.cookies}</Link></li>
              <li><Link href="/account"  className="text-white/75 hover:text-primary transition-colors">{f.accountSettings}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} AutoMarket. {f.rights}</p>
          <div className="flex items-center gap-6 text-xs text-white/35">
            <Link href="/terms"   className="hover:text-primary transition-colors">{f.footerTerms}</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">{f.footerPrivacy}</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">{f.footerCookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
