"use client";

import { ShieldCheck } from "lucide-react";

export function SafetyBanner() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-3xl p-5">
      <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5" /> Safety Tips
      </h4>
      <ul className="text-sm text-blue-800/80 dark:text-blue-200/80 space-y-1.5 list-disc pl-5 marker:text-blue-400">
        <li>Never pay in advance</li>
        <li>Meet in a public place</li>
        <li>Test drive before buying</li>
        <li>Verify VIN before purchase</li>
      </ul>
    </div>
  );
}
