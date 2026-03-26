"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Mail, Phone, MapPin, CheckCircle2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Section } from "./account-shared";
import type { MockUser } from "@/lib/mock-data";

const schema = z.object({
  firstName: z.string().min(1, "Required."),
  lastName:  z.string().min(1, "Required."),
  username:  z.string().min(1, "Required."),
  email:     z.string().email("Enter a valid email."),
  phone:     z.string().optional(),
  location:  z.string().optional(),
  bio:       z.string().max(300, "Max 300 characters.").optional(),
  avatarUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm({
  user,
  onSave,
}: {
  user: MockUser;
  onSave: (data: Partial<MockUser>) => void;
}) {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName:  user?.lastName ?? "",
      username:  user?.username ?? "",
      email:     (user as any)?.email ?? "john.doe@example.com",
      phone:     (user as any)?.phone ?? "",
      location:  (user as any)?.location ?? "",
      bio:       (user as any)?.bio ?? "",
      avatarUrl: user?.profileImageUrl ?? "",
    },
  });

  const avatarUrl = watch("avatarUrl") ?? "";
  const firstName = watch("firstName") ?? "";
  const lastName  = watch("lastName") ?? "";
  const bio       = watch("bio") ?? "";

  const onSubmit = (data: FormValues) => {
    onSave({
      firstName: data.firstName,
      lastName:  data.lastName,
      username:  data.username,
      profileImageUrl: data.avatarUrl?.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Section title="Profile Information" icon={User}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={() => {}} />
            ) : (
              <span className="font-display font-bold text-2xl text-primary">
                {firstName[0]}{lastName[0]}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-2">Profile Photo</p>
            <Input
              placeholder="https://example.com/photo.jpg"
              icon={<Camera className="w-4 h-4" />}
              className="text-sm"
              {...register("avatarUrl")}
            />
            <p className="text-xs text-muted-foreground mt-2">Paste an image URL. Changes apply after saving.</p>
          </div>
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">First Name</label>
            <Input placeholder="First name" {...register("firstName")} />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Last Name</label>
            <Input placeholder="Last name" {...register("lastName")} />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <label className="text-sm font-medium text-foreground">Username</label>
          <Input
            placeholder="@username"
            icon={<span className="text-muted-foreground text-sm font-semibold">@</span>}
            {...register("username")}
          />
          {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
        </div>

        <div className="space-y-2 mb-5">
          <label className="text-sm font-medium text-foreground">Email Address</label>
          <Input type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone</label>
            <Input placeholder="+1 (555) 000-0000" icon={<Phone className="w-4 h-4" />} {...register("phone")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <Input placeholder="City, State" icon={<MapPin className="w-4 h-4" />} {...register("location")} />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            placeholder="Tell buyers a little about yourself..."
            rows={3}
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
            {...register("bio")}
          />
          <p className="text-xs text-muted-foreground">{bio.length}/300 characters</p>
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          {saved && (
            <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Profile saved!
            </span>
          )}
          <Button type="submit" className="ml-auto">
            Save Profile
          </Button>
        </div>
      </form>
    </Section>
  );
}
