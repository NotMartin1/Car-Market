"use client";

import { useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, Toggle } from "./account-shared";

export function NotificationSettings() {
  const [notifNewInquiry, setNotifNewInquiry] = useState(true);
  const [notifMessages,   setNotifMessages]   = useState(true);
  const [notifMarketing,  setNotifMarketing]  = useState(false);
  const [saved,           setSaved]           = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Section title="Notification Preferences" icon={Bell}>
      <Toggle
        label="New Inquiry Received"
        description="Get notified when someone sends an inquiry on your listing."
        checked={notifNewInquiry}
        onChange={setNotifNewInquiry}
      />
      <Toggle
        label="New Message"
        description="Get notified when you receive a new message."
        checked={notifMessages}
        onChange={setNotifMessages}
      />
      <Toggle
        label="Marketing & Updates"
        description="Receive occasional tips, deals, and product news from AutoMarket."
        checked={notifMarketing}
        onChange={setNotifMarketing}
      />

      <div className="flex items-center justify-between mt-6">
        {saved && (
          <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Preferences saved!
          </span>
        )}
        <Button onClick={handleSave} variant="outline" className="ml-auto">
          Save Preferences
        </Button>
      </div>
    </Section>
  );
}
