import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://scuderia-apex.vercel.app"),
  title: "SCUDERIA APEX — Engineered for Speed",
  description:
    "An immersive, scroll-driven automotive cinematic film and technical engineering analysis powered by an authoritative 1,311-frame streaming Canvas engine.",
  keywords: [
    "Scuderia Apex",
    "Formula 1",
    "Automotive Film",
    "Cinematic Experience",
    "Engineering Analysis",
    "Telemetry",
    "Canvas Animation",
    "Next.js",
    "Aerodynamics",
  ],
  authors: [{ name: "Scuderia Apex Engineering" }],
  creator: "Scuderia Apex",
  publisher: "Scuderia Apex",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scuderia-apex.vercel.app",
    title: "SCUDERIA APEX — Engineered for Speed",
    description:
      "An immersive scroll-driven automotive cinematic and engineering analysis powered by a 1,311-frame streaming Canvas engine.",
    siteName: "Scuderia Apex",
    images: [
      {
        url: "/frames-webp/0001.webp",
        width: 1920,
        height: 1080,
        alt: "Scuderia Apex — Engineered for Speed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SCUDERIA APEX — Engineered for Speed",
    description:
      "An immersive scroll-driven automotive cinematic and engineering analysis powered by a 1,311-frame streaming Canvas engine.",
    images: ["/frames-webp/0001.webp"],
    creator: "@scuderia_apex",
  },
  icons: {
    icon: "/favicon.ico",
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
      className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable} bg-bg-primary text-text-primary`}
    >
      <body className="antialiased select-none overflow-x-hidden bg-bg-primary">
        {children}
      </body>
    </html>
  );
}
