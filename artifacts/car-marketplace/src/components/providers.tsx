"use client";

import { MockAuthProvider } from "@/contexts/mock-auth-context";
import { AuthModalProvider } from "@/contexts/auth-modal-context";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MockAuthProvider>
        <AuthModalProvider>
          <TooltipProvider>
            {children}
            <AuthModal />
            <Toaster />
          </TooltipProvider>
        </AuthModalProvider>
      </MockAuthProvider>
    </LanguageProvider>
  );
}
