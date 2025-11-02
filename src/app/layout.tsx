import Navigation from "@/components/Navigation";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Navigation />
        <main className="min-h-screen bg-linear-to-br from-violet-50 via-white to-orange-50 pt-12">
          {children}
        </main>

        {/* React Grab script - only in development */}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="afterInteractive"
            data-enabled="true"
          />
        )}
          </ThemeProvider>
      </body>
    </html>
  );
}
