"use client";

import { StoreProvider } from "@/components/store-provider";
import { DarkModeProvider } from "@/contexts/dark-mode-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { FloatingChat } from "@/components/chat/FloatingChat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <DarkModeProvider>
        <TooltipProvider>
          {children}
          <AuthModal />
          <Toaster />
          <FloatingChat />
        </TooltipProvider>
      </DarkModeProvider>
    </StoreProvider>
  );
}
