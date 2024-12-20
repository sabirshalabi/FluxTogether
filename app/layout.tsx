import Providers from "@/app/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const title = "FluxTogether[free] – Real-Time AI Image Generator";
const description = "Generate images with AI in milliseconds";
const url = "https://fluxtogether.com";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(url),
  openGraph: {
    title,
    description,
    url,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark h-full min-h-full bg-[length:6px] font-mono text-gray-100 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
