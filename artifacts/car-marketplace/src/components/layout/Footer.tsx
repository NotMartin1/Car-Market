import { Car } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent text-accent-foreground p-1.5 rounded-lg">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                AutoMarket
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              The most trusted marketplace for buying and selling premium used vehicles. 
              Find your dream car today.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><Link href="/listings" className="hover:text-accent transition-colors">Browse Cars</Link></li>
              <li><Link href="/post" className="hover:text-accent transition-colors">Sell Your Car</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} AutoMarket. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-xs">Generated for Replit User</p>
        </div>
      </div>
    </footer>
  );
}
