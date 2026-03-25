"use client";

import { MockAuthProvider } from "@/contexts/mock-auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockAuthProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </MockAuthProvider>
  );
}
