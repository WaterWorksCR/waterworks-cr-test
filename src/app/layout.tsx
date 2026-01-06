import type { Metadata } from "next";
import { Barlow, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Water Works C&R",
  description: "High-quality construction and restoration services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${barlow.className} ${barlow.variable} ${fraunces.variable} flex min-h-screen flex-col bg-background text-foreground`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
