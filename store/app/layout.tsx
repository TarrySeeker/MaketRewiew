import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NUW / PREMIUM APPAREL",
  description: "Multibrand premium streetwear and contemporary fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={cn(
          inter.variable,
          "antialiased bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-brand-accent selection:text-brand-black"
        )}
      >
        {children}
        <Toaster theme="light" position="bottom-right" />
      </body>
    </html>
  );
}
