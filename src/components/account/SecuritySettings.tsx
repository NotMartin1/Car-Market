"use client";

import { useState } from "react";
import { Shield, Lock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Section } from "./account-shared";

export function SecuritySettings() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");

  const handleSave = () => {
    setError("");
    if (!currentPw) { setError("Please enter your current password."); return; }
    if (newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setSaved(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Section title="Security" icon={Shield}>
      <p className="text-sm text-muted-foreground mb-6">Update your password to keep your account secure.</p>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Current Password</label>
          <Input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="Enter current password"
            icon={<Lock className="w-4 h-4" />}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">New Password</label>
          <Input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="At least 8 characters"
            icon={<Lock className="w-4 h-4" />}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Confirm New Password</label>
          <Input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Repeat new password"
            icon={<Lock className="w-4 h-4" />}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="flex items-center justify-between">
        {saved && (
          <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Password updated!
          </span>
        )}
        <Button onClick={handleSave} variant="outline" className="ml-auto">
          Update Password
        </Button>
      </div>
    </Section>
  );
}
