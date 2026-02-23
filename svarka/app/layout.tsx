import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google"; // Syne for headings, Manrope for UI
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IRONFORGE | Premium Industrial Services",
  description: "High-precision welding services for industrial and residential needs.",
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
          manrope.variable,
          syne.variable,
          "antialiased bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-brand-accent selection:text-brand-black"
        )}
      >
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
