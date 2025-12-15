import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Ghafir",
  description: "PWA for prayer times, adhkar, and Qibla guidance.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Logos/logo-png-purple.png", type: "image/png" },
      { url: "/Logos/logo-png-white.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/Logos/logo-png-purple.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [
      { url: "/Logos/logo-png-purple.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/Logos/logo-png-purple.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Logos/logo-png-purple.png" sizes="180x180" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
