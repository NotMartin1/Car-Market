"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  User,
  Camera,
  Bell,
  Shield,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Car,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Lock,
} from "lucide-react";
import Link from "next/link";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden card-shadow">
      <div className="px-6 py-5 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function AccountPage() {
  const { user, isAuthenticated, updateUser, logout } = useMockAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState((user as any)?.bio ?? "");
  const [location, setLocation] = useState((user as any)?.location ?? "");
  const [phone, setPhone] = useState((user as any)?.phone ?? "");
  const [email, setEmail] = useState((user as any)?.email ?? "john.doe@example.com");
  const [avatarUrl, setAvatarUrl] = useState(user?.profileImageUrl ?? "");

  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [notifNewInquiry, setNotifNewInquiry] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleProfileSave = () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setProfileError("First name, last name, and username are required.");
      return;
    }
    setProfileError("");
    updateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      profileImageUrl: avatarUrl.trim() || undefined,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleNotifSave = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const handlePwSave = () => {
    setPwError("");
    if (!currentPw) { setPwError("Please enter your current password."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    setPwSaved(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-foreground text-background pt-28 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Account Settings</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Account Settings</h1>
          <p className="text-white/50">Manage your profile, preferences, and security.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/my-listings", icon: Car, label: "My Listings" },
            { href: "/my-inquiries", icon: MessageSquare, label: "My Inquiries" },
            { href: "/messages", icon: Bell, label: "Messages" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-md transition-all card-shadow group"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-semibold text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </Link>
          ))}
        </div>

        {/* Profile */}
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
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@username" icon={<span className="text-muted-foreground text-sm font-semibold">@</span>} />
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

          {profileError && (
            <p className="text-sm text-destructive mb-4">{profileError}</p>
          )}

          <div className="flex items-center justify-between">
            {profileSaved && (
              <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Profile saved!
              </span>
            )}
            <Button onClick={handleProfileSave} className="ml-auto">
              Save Profile
            </Button>
          </div>
        </Section>

        {/* Notifications */}
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
            {notifSaved && (
              <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved!
              </span>
            )}
            <Button onClick={handleNotifSave} variant="outline" className="ml-auto">
              Save Preferences
            </Button>
          </div>
        </Section>

        {/* Security */}
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

          {pwError && <p className="text-sm text-destructive mb-4">{pwError}</p>}

          <div className="flex items-center justify-between">
            {pwSaved && (
              <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Password updated!
              </span>
            )}
            <Button onClick={handlePwSave} variant="outline" className="ml-auto">
              Update Password
            </Button>
          </div>
        </Section>

        {/* Danger zone */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-foreground mb-2 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-destructive" />
            Sign Out
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            You will be signed out of your account on this device. Your listings and messages will remain intact.
          </p>
          <Button
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            onClick={() => { logout(); router.push("/"); }}
          >
            Sign Out of AutoMarket
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
