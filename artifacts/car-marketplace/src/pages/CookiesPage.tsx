"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Cookie, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const cookieTypes = [
  {
    name: "Strictly Necessary",
    id: "necessary",
    required: true,
    description: "Essential for the website to function. These cannot be disabled.",
    examples: ["Authentication session cookies", "CSRF protection tokens", "Load balancing cookies"],
  },
  {
    name: "Functional",
    id: "functional",
    required: false,
    description: "Remember your preferences and personalise your experience.",
    examples: ["Language preferences", "Search filter settings", "Recently viewed listings"],
  },
  {
    name: "Analytics",
    id: "analytics",
    required: false,
    description: "Help us understand how visitors interact with the platform.",
    examples: ["Page view counts", "Session duration data", "Feature usage statistics"],
  },
  {
    name: "Marketing",
    id: "marketing",
    required: false,
    description: "Used to deliver relevant advertisements and track campaign performance.",
    examples: ["Retargeting pixels", "Conversion tracking", "Audience segmentation"],
  },
];

export default function CookiesPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      {/* Hero */}
      <div className="bg-foreground text-background pt-28 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Cookie Policy</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white">Cookie Policy</h1>
          </div>
          <p className="text-white/55 mt-3">Last updated: March 25, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="prose-legal mb-12">
          <p className="text-base">
            This Cookie Policy explains what cookies are, how AutoMarket uses them, and what choices you have regarding
            their use. Please read this policy alongside our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device by a website when you visit it. They are widely used to
            make websites work efficiently, remember your preferences, and provide information to the website owners.
            Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (stored for
            a set period or until you delete them).
          </p>

          <h2>How We Use Cookies</h2>
          <p>
            AutoMarket uses cookies for four main purposes: to keep the site functioning, to remember your preferences,
            to analyse usage patterns, and to deliver relevant advertising. The table below describes each category in
            detail.
          </p>
        </div>

        {/* Cookie preference manager */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden card-shadow mb-12">
          <div className="px-6 py-5 border-b border-border bg-muted/30">
            <h2 className="text-xl font-display font-bold text-foreground">Manage Your Cookie Preferences</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Toggle optional cookie categories below. Strictly necessary cookies cannot be disabled.
            </p>
          </div>

          <div className="divide-y divide-border">
            {cookieTypes.map((ct) => (
              <div key={ct.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-foreground font-display">{ct.name}</span>
                    {ct.required && (
                      <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{ct.description}</p>
                  <ul className="space-y-1">
                    {ct.examples.map((ex) => (
                      <li key={ex} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Toggle */}
                <div className="shrink-0 flex items-center gap-2 mt-1">
                  {prefs[ct.id] ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-muted-foreground/50" />
                  )}
                  <button
                    disabled={ct.required}
                    onClick={() => setPrefs((p) => ({ ...p, [ct.id]: !p[ct.id] }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      prefs[ct.id] ? "bg-primary" : "bg-border"
                    } ${ct.required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        prefs[ct.id] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 bg-muted/20 border-t border-border flex items-center justify-between">
            {saved ? (
              <span className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved!
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Changes are saved for this browser.</span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* More info */}
        <div className="prose-legal">
          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies on AutoMarket are placed by third-party services that appear on our pages. These include
            analytics providers (such as Google Analytics) and advertising networks. These third parties have their
            own privacy policies that govern their use of cookies, and we encourage you to review them.
          </p>

          <h2>How to Control Cookies</h2>
          <p>
            In addition to the controls above, most web browsers allow you to manage cookies through their settings:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
          </ul>
          <p>
            Please note that blocking certain cookies may impact the functionality of AutoMarket. For example,
            disabling strictly necessary cookies will prevent you from logging in.
          </p>

          <h2>Do Not Track</h2>
          <p>
            Some browsers offer a "Do Not Track" (DNT) feature that signals to websites that you do not want your
            browsing activity tracked. Because there is no industry standard for how to respond to DNT signals, we do
            not currently alter our practices when we receive a DNT signal from your browser.
          </p>

          <h2>Contact Us</h2>
          <p>If you have questions about our use of cookies, please contact us at privacy@automarket.com.</p>
        </div>

        <div className="mt-12 p-6 bg-muted/50 border border-border rounded-2xl">
          <p className="text-sm text-muted-foreground">
            See also:{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {" "}·{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
