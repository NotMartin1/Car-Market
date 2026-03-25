"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "information", title: "Information We Collect" },
  { id: "use", title: "How We Use Your Information" },
  { id: "sharing", title: "Sharing Your Information" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "retention", title: "Data Retention" },
  { id: "rights", title: "Your Privacy Rights" },
  { id: "security", title: "Security" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <AppLayout>
      {/* Hero */}
      <div className="bg-foreground text-background pt-28 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Privacy Policy</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-white/55 mt-3">Last updated: March 25, 2026</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sticky TOC */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-28 bg-card border border-border rounded-2xl p-5 card-shadow">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contents</p>
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <article className="flex-1 prose-legal">
          <p className="text-muted-foreground mb-8 text-base leading-relaxed">
            At AutoMarket, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our platform.
          </p>

          <section id="information">
            <h2>1. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <ul>
              <li>Account registration data (name, email address, username, phone number).</li>
              <li>Profile information (bio, profile photo, location).</li>
              <li>Vehicle listing details (make, model, year, description, photos, price).</li>
              <li>Messages sent through our in-platform messaging system.</li>
              <li>Communications with our support team.</li>
            </ul>
            <h3>Information Collected Automatically</h3>
            <ul>
              <li>Device information (browser type, operating system, device identifiers).</li>
              <li>Usage data (pages visited, time spent, features used).</li>
              <li>IP address and general geographic location.</li>
              <li>Cookies and similar tracking technologies (see our Cookie Policy).</li>
            </ul>
          </section>

          <section id="use">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Operate and improve the AutoMarket platform and its features.</li>
              <li>Create and manage your account and listings.</li>
              <li>Facilitate communication between buyers and sellers.</li>
              <li>Send transactional emails (listing confirmations, inquiry notifications).</li>
              <li>Send marketing communications if you have opted in.</li>
              <li>Detect and prevent fraud, abuse, and security incidents.</li>
              <li>Comply with legal obligations and enforce our Terms of Service.</li>
              <li>Analyse usage trends and improve the user experience.</li>
            </ul>
          </section>

          <section id="sharing">
            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell your personal data. We may share your information in the following circumstances:
            </p>
            <h3>With Other Users</h3>
            <p>
              Your name, username, and listing content are visible to other AutoMarket users as part of the normal
              functioning of the marketplace. Your contact details are only shared when you choose to disclose them in
              messages or listing descriptions.
            </p>
            <h3>With Service Providers</h3>
            <p>
              We engage trusted third-party service providers to help operate the platform, including cloud hosting,
              email delivery, analytics, and fraud prevention. These providers are contractually obligated to protect
              your data and may not use it for their own purposes.
            </p>
            <h3>Legal & Safety</h3>
            <p>
              We may disclose your information if required by law, court order, or to protect the rights, safety, and
              property of AutoMarket, our users, or the public.
            </p>
          </section>

          <section id="cookies">
            <h2>4. Cookies & Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform. For detailed
              information about the types of cookies we use and your choices, please review our{" "}
              <Link href="/cookies">Cookie Policy</Link>.
            </p>
          </section>

          <section id="retention">
            <h2>5. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide you with our
              services. If you delete your account, we will delete or anonymise your personal data within 90 days,
              except where retention is required for legal compliance, dispute resolution, or fraud prevention.
            </p>
            <p>
              Listing data may be retained in anonymised form for market analysis purposes.
            </p>
          </section>

          <section id="rights">
            <h2>6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request that we delete your personal data.</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to certain types of processing, including direct marketing.</li>
              <li><strong>Restriction:</strong> Request that we restrict the processing of your data in certain circumstances.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at privacy@automarket.com. We will respond within 30
              days. You also have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>

          <section id="security">
            <h2>7. Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data, including TLS encryption
              for data in transit, AES-256 encryption for data at rest, and role-based access controls for our
              internal systems.
            </p>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we
              strive to protect your data, we cannot guarantee absolute security. Please use a strong, unique password
              and enable two-factor authentication if available.
            </p>
          </section>

          <section id="children">
            <h2>8. Children's Privacy</h2>
            <p>
              AutoMarket is not directed to children under the age of 18. We do not knowingly collect personal
              information from children. If you believe we have inadvertently collected information from a child, please
              contact us immediately and we will take steps to delete the information.
            </p>
          </section>

          <section id="changes">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make material changes, we will update the
              date at the top of this page and notify you by email or through a prominent notice on our platform.
              Your continued use of AutoMarket after such changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section id="contact">
            <h2>10. Contact Us</h2>
            <p>If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: privacy@automarket.com</li>
              <li>Address: 123 Market Street, San Francisco, CA 94105</li>
              <li>Data Protection Officer: dpo@automarket.com</li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-muted/50 border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground">
              See also:{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {" "}·{" "}
              <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>
            </p>
          </div>
        </article>
      </div>
    </AppLayout>
  );
}
