"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Lock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Section } from "./account-shared";

const schema = z.object({
  currentPassword: z.string().min(1, "Please enter your current password."),
  newPassword:     z.string().min(8, "New password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

export function SecuritySettings() {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (_data: FormValues) => {
    setSaved(true);
    reset();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Section title="Security" icon={Shield}>
      <p className="text-sm text-muted-foreground mb-6">Update your password to keep your account secure.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Current Password</label>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Enter current password"
            icon={<Lock className="w-4 h-4" />}
            {...register("currentPassword")}
          />
          {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">New Password</label>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            icon={<Lock className="w-4 h-4" />}
            {...register("newPassword")}
          />
          {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Confirm New Password</label>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="Repeat new password"
            icon={<Lock className="w-4 h-4" />}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Password updated!
            </span>
          )}
          <Button type="submit" variant="outline" className="ml-auto">
            Update Password
          </Button>
        </div>
      </form>
    </Section>
  );
}
