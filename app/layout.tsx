import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { ADSENSE_CLIENT } from "@/lib/ads";
import { CONTACT_EMAIL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoMaltaNow | Malta Made Simple: Visit, Move and Live in Malta",
  description:
    "Practical guides for visiting, moving to and living in Malta: beaches, housing, jobs, residence permits, healthcare, banking and the latest official updates.",
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Google AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>

      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        {children}

        <div className="border-t border-white/10 bg-[#0B0D0F] text-sm text-white/55">
          <nav
            aria-label="Legal"
            className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4 md:justify-end md:px-8"
          >
            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Advertising%20on%20GoMaltaNow`}
              className="transition hover:text-white"
            >
              Advertise with us
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition hover:text-white"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Cloudflare Web Analytics (visite reali) */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e1a4cdf6dd884df4b4a0ef3ab241452c"}'
        />
      </body>
    </html>
  );
}
