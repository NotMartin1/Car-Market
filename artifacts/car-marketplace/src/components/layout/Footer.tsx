import { Car } from "lucide-react";
import Link from "next/link";

export function Footer() {
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
              <span className="font-display font-bold text-xl tracking-tight text-white">
                AutoMarket
              </span>
            </div>
            <p className="text-white/55 max-w-sm leading-relaxed text-sm">
              The most trusted marketplace for buying and selling premium used vehicles.
              Find your dream car, truck, or motorcycle today — no hidden fees.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-white text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/listings" className="text-white/75 hover:text-primary transition-colors">Browse Vehicles</Link>
              </li>
              <li>
                <Link href="/post" className="text-white/75 hover:text-primary transition-colors">Sell Your Vehicle</Link>
              </li>
              <li>
                <Link href="/my-listings" className="text-white/75 hover:text-primary transition-colors">My Listings</Link>
              </li>
              <li>
                <Link href="/messages" className="text-white/75 hover:text-primary transition-colors">Messages</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-white text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="text-white/75 hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/75 hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white/75 hover:text-primary transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/account" className="text-white/75 hover:text-primary transition-colors">Account Settings</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} AutoMarket. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-white/35">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
