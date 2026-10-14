import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://musimku.vercel.app"),
  title: "Musimku — Explore Indonesia’s Seasons",
  description:
    "An interactive calendar for exploring Indonesia’s rainy and dry seasons, regional climate patterns, and the science behind monsoons.",
  applicationName: "Musimku",
  openGraph: {
    title: "Musimku — Explore Indonesia’s Seasons",
    description: "Watch Indonesia’s seasons change throughout the year.",
    type: "website",
    siteName: "Musimku",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musimku — Explore Indonesia’s Seasons",
    description: "Explore Indonesia’s seasons through an interactive climate calendar.",
  },
};

export const viewport: Viewport = {
  themeColor: "#101817",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
