"use client";

import { ShieldCheck, Car as CarIcon, DollarSign } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, title: "Verified Sellers",  desc: "Every seller is authenticated to ensure a safe, scam-free buying experience." },
  { icon: CarIcon,     title: "Vast Selection",    desc: "Cars, trucks, motorcycles, boats & more — new listings added every day."     },
  { icon: DollarSign,  title: "No Hidden Fees",    desc: "Negotiate directly with sellers. We never take a cut of the sale."           },
];

export function TrustFeatures() {
  return (
    <section className="py-20 bg-background border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground">Why AutoMarket?</h2>
          <p className="text-muted-foreground mt-2">Thousands of buyers and sellers trust us every day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={i} className="bg-card p-8 rounded-2xl border border-border card-shadow hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
