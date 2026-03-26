import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "../index.css";

export const metadata: Metadata = {
  title: "AutoMarket — Find Your Next Dream Vehicle",
  description: "Browse thousands of premium used vehicles — cars, trucks, motorcycles & more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Apply dark mode class before React hydrates to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('automarket_dark')==='true')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
