"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner({
  title,
  subtitle,
  postLabel,
  browseLabel,
}: {
  title: string;
  subtitle: string;
  postLabel: string;
  browseLabel: string;
}) {
  return (
    <section className="bg-foreground py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{title}</h2>
        <p className="text-white/55 mb-8 text-lg">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/post">
            <Button size="lg" className="h-13 px-10 text-base font-bold shadow-xl shadow-primary/30">
              {postLabel}
            </Button>
          </Link>
          <Link href="/listings">
            <Button size="lg" variant="outline" className="h-13 px-10 text-base font-semibold border-white/20 text-white hover:bg-white/10 hover:border-white/40">
              {browseLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
