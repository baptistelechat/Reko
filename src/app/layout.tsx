import Navigation from "@/components/Navigation";
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

export const metadata: Metadata = {
  title: "REKO - Recommandations Films & Séries",
  description:
    "Découvrez des films et séries personnalisés selon votre humeur et votre temps libre",
  keywords: "films, séries, recommandations, streaming, TMDB",
  authors: [{ name: "REKO Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main className="min-h-screen pt-12 bg-linear-to-br from-violet-50 via-white to-orange-50">
          {children}
        </main>
      </body>
    </html>
  );
}
