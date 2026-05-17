import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Dashboard Kesehatan | Bapak Syafriman",
  description:
    "Dashboard interaktif pemantauan kesehatan mandiri — Analisis data klinis laboratorium RS Jantung Heartology (Nov 2024 – Mei 2026)",
  keywords: ["kesehatan", "dashboard", "pemantauan", "diabetes", "ginjal", "HbA1c"],
  authors: [{ name: "Tim Pengembangan Kesehatan Digital" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
