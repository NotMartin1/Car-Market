"use client";

import { MockAuthProvider } from "@/contexts/mock-auth-context";
import { AuthModalProvider } from "@/contexts/auth-modal-context";
import { LanguageProvider } from "@/contexts/language-context";
import { SavedProvider } from "@/contexts/saved-context";
import { DarkModeProvider } from "@/contexts/dark-mode-context";
import { NotificationsProvider } from "@/contexts/notifications-context";
import { CompareProvider } from "@/contexts/compare-context";
import { FloatingChatProvider } from "@/contexts/floating-chat-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { FloatingChat } from "@/components/chat/FloatingChat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <MockAuthProvider>
          <AuthModalProvider>
            <NotificationsProvider>
              <SavedProvider>
                <CompareProvider>
                  <FloatingChatProvider>
                    <TooltipProvider>
                      {children}
                      <AuthModal />
                      <Toaster />
                      <FloatingChat />
                    </TooltipProvider>
                  </FloatingChatProvider>
                </CompareProvider>
              </SavedProvider>
            </NotificationsProvider>
          </AuthModalProvider>
        </MockAuthProvider>
      </LanguageProvider>
    </DarkModeProvider>
  );
}
