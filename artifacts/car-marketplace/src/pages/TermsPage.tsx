"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "eligibility", title: "Eligibility" },
  { id: "account", title: "Account Responsibilities" },
  { id: "listings", title: "Listings & Content" },
  { id: "transactions", title: "Transactions" },
  { id: "prohibited", title: "Prohibited Conduct" },
  { id: "disclaimer", title: "Disclaimers" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsPage() {
  return (
    <AppLayout>
      {/* Hero */}
      <div className="bg-foreground text-background pt-28 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Terms of Service</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white">Terms of Service</h1>
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
            Welcome to AutoMarket. By accessing or using our platform, you agree to be bound by these Terms of Service.
            Please read them carefully before using the site.
          </p>

          <section id="acceptance">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating an account or using AutoMarket in any manner, you agree to these Terms and our Privacy Policy.
              If you do not agree to these terms, you may not access or use the service. These Terms apply to all
              visitors, registered users, and others who access or use the platform.
            </p>
          </section>

          <section id="eligibility">
            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use AutoMarket. By agreeing to these Terms, you represent and warrant
              that you are at least 18 years of age. If you are accessing the service on behalf of a company or other
              legal entity, you further represent that you have the authority to bind such entity.
            </p>
          </section>

          <section id="account">
            <h2>3. Account Responsibilities</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. You are
              responsible for safeguarding your account credentials and for any activity that occurs under your account.
            </p>
            <ul>
              <li>Do not share your login credentials with any third party.</li>
              <li>Notify us immediately of any unauthorised access to your account.</li>
              <li>You are responsible for all content posted under your account.</li>
              <li>AutoMarket is not liable for any losses caused by unauthorised use of your account.</li>
            </ul>
          </section>

          <section id="listings">
            <h2>4. Listings & Content</h2>
            <p>
              AutoMarket allows users to post vehicle listings. By posting a listing, you represent that you have the
              legal right to sell the described vehicle and that all information provided is accurate and complete.
            </p>
            <h3>Prohibited Listings</h3>
            <p>You may not list vehicles that:</p>
            <ul>
              <li>Are stolen or have a salvage title without clear disclosure.</li>
              <li>Have materially inaccurate descriptions, mileage, or condition details.</li>
              <li>Are subject to undisclosed liens or encumbrances.</li>
              <li>Involve any form of fraudulent misrepresentation.</li>
            </ul>
            <h3>Content License</h3>
            <p>
              By posting content on AutoMarket, you grant us a worldwide, non-exclusive, royalty-free licence to use,
              display, and distribute that content solely for the purpose of operating and improving the platform.
            </p>
          </section>

          <section id="transactions">
            <h2>5. Transactions</h2>
            <p>
              AutoMarket is a marketplace platform and is not a party to any transaction between buyers and sellers.
              We do not take possession of vehicles, hold funds in escrow, or guarantee the completion of any sale.
              All transactions are between private parties and AutoMarket bears no liability for disputes arising from them.
            </p>
            <p>
              We strongly recommend that buyers inspect vehicles in person, verify ownership documents, and use secure
              payment methods before completing any purchase.
            </p>
          </section>

          <section id="prohibited">
            <h2>6. Prohibited Conduct</h2>
            <p>You agree not to engage in any of the following activities:</p>
            <ul>
              <li>Posting false, misleading, or fraudulent listings.</li>
              <li>Harassing, threatening, or abusing other users.</li>
              <li>Scraping or data-mining the platform without written consent.</li>
              <li>Circumventing or disabling any security feature of the site.</li>
              <li>Using the platform for any unlawful purpose.</li>
              <li>Impersonating any person or entity.</li>
            </ul>
            <p>
              Violation of these rules may result in the immediate suspension or termination of your account without
              prior notice.
            </p>
          </section>

          <section id="disclaimer">
            <h2>7. Disclaimers</h2>
            <p>
              The AutoMarket platform is provided "as is" and "as available" without warranties of any kind, either
              express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of
              viruses or other harmful components.
            </p>
            <p>
              AutoMarket does not verify the accuracy of vehicle descriptions, ownership claims, or the legal status of
              listed vehicles. Users transact at their own risk.
            </p>
          </section>

          <section id="liability">
            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, AutoMarket and its officers, directors, employees,
              and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages
              arising out of or in connection with your use of the platform, even if we have been advised of the
              possibility of such damages.
            </p>
            <p>
              Our aggregate liability to you for any direct damages will not exceed the greater of (a) the fees you
              paid to AutoMarket in the twelve months preceding the claim, or (b) one hundred US dollars ($100).
            </p>
          </section>

          <section id="indemnification">
            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless AutoMarket and its affiliates, officers, directors,
              employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including
              reasonable legal fees, arising out of or in any way connected with your access to or use of the platform,
              your listings or content, or your violation of these Terms.
            </p>
          </section>

          <section id="changes">
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. When we make material changes, we will notify you
              by updating the date at the top of this page and, where appropriate, sending you an email notification.
              Your continued use of AutoMarket after any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section id="contact">
            <h2>11. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <ul>
              <li>Email: legal@automarket.com</li>
              <li>Address: 123 Market Street, San Francisco, CA 94105</li>
              <li>Phone: +1 (800) 555-0199</li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-muted/50 border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground">
              See also:{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              {" "}·{" "}
              <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>
            </p>
          </div>
        </article>
      </div>
    </AppLayout>
  );
}
