import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Checkout Rescue",
  description: "Checkout diagnostics for Stripe, Shopify and Shopify Payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}