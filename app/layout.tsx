import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://portfolio-three-liard-sawz2jnsjs.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mohamed Idbenouakrim — Software Engineer",
    template: "%s | Mohamed Idbenouakrim",
  },
  description:
    "Software engineer focused on backend development — scalable APIs, Node.js, Python, FastAPI, and full-stack React. Based in Casablanca.",
  keywords: [
    "software engineer",
    "backend developer",
    "Node.js",
    "Python",
    "FastAPI",
    "React",
    "Casablanca",
    "Morocco",
  ],
  authors: [{ name: "Mohamed Idbenouakrim", url: SITE_URL }],
  creator: "Mohamed Idbenouakrim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Mohamed Idbenouakrim",
    title: "Mohamed Idbenouakrim — Software Engineer",
    description:
      "Software engineer focused on backend development — scalable APIs, Node.js, Python, FastAPI, and full-stack React. Based in Casablanca.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Idbenouakrim — Software Engineer",
    description:
      "Software engineer focused on backend development — scalable APIs, Node.js, Python, FastAPI, and full-stack React. Based in Casablanca.",
  },
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohamed Idbenouakrim",
  url: SITE_URL,
  email: "medidbenouakrim@gmail.com",
  jobTitle: "Software Engineer",
  description:
    "Software engineer focused on backend development — scalable APIs, Node.js, Python, FastAPI, and full-stack React.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Casablanca",
    addressCountry: "MA",
  },
  sameAs: [
    "https://github.com/devloopcode",
    "https://www.linkedin.com/in/mohamed-idbenouakrim-37528219a/",
  ],
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
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Skip link — invisible until focused; lets keyboard users jump past nav */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-99999 focus:rounded-lg focus:bg-(--accent) focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
