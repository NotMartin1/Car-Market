"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin, CheckCircle2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Section } from "./account-shared";
import type { MockUser } from "@/lib/mock-data";

export function ProfileForm({
  user,
  onSave,
}: {
  user: MockUser;
  onSave: (data: Partial<MockUser>) => void;
}) {
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName,  setLastName]  = useState(user?.lastName ?? "");
  const [username,  setUsername]  = useState(user?.username ?? "");
  const [bio,       setBio]       = useState((user as any)?.bio ?? "");
  const [location,  setLocation]  = useState((user as any)?.location ?? "");
  const [phone,     setPhone]     = useState((user as any)?.phone ?? "");
  const [email,     setEmail]     = useState((user as any)?.email ?? "john.doe@example.com");
  const [avatarUrl, setAvatarUrl] = useState(user?.profileImageUrl ?? "");

  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setError("First name, last name, and username are required.");
      return;
    }
    setError("");
    onSave({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      username:  username.trim(),
      profileImageUrl: avatarUrl.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Section title="Profile Information" icon={User}>
      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={() => setAvatarUrl("")} />
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
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            icon={<Camera className="w-4 h-4" />}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">Paste an image URL. Changes apply after saving.</p>
        </div>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">First Name</label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last Name</label>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <label className="text-sm font-medium text-foreground">Username</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="@username"
          icon={<span className="text-muted-foreground text-sm font-semibold">@</span>}
        />
      </div>

      <div className="space-y-2 mb-5">
        <label className="text-sm font-medium text-foreground">Email Address</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" icon={<Phone className="w-4 h-4" />} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" icon={<MapPin className="w-4 h-4" />} />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium text-foreground">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell buyers a little about yourself..."
          rows={3}
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
        />
        <p className="text-xs text-muted-foreground">{bio.length}/300 characters</p>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="flex items-center justify-between">
        {saved && (
          <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Profile saved!
          </span>
        )}
        <Button onClick={handleSave} className="ml-auto">
          Save Profile
        </Button>
      </div>
    </Section>
  );
}
