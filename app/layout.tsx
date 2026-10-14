import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://musimku.vercel.app"),
  title: "Musimku — Jelajahi Musim Indonesia",
  description:
    "Kalender interaktif untuk menjelajahi musim hujan dan kemarau, cuaca terkini, pola iklim berbagai wilayah Indonesia, dan ilmu monsun.",
  applicationName: "Musimku",
  openGraph: {
    title: "Musimku — Jelajahi Musim Indonesia",
    description: "Amati perubahan musim Indonesia sepanjang tahun dengan cuaca terkini.",
    type: "website",
    siteName: "Musimku",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musimku — Jelajahi Musim Indonesia",
    description: "Jelajahi musim Indonesia melalui kalender iklim interaktif.",
  },
};

export const viewport: Viewport = {
  themeColor: "#101817",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
