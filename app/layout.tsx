/* eslint-disable @next/next/no-page-custom-font */
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
  title: "PearLens",
  description: "Capture and share memories - effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Ensure Alex Brush font loads before canvas watermark */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        {/* Optional luxe video backdrop (set NEXT_PUBLIC_BG_VIDEO_URL) */}
        {process.env.NEXT_PUBLIC_BG_VIDEO_URL && (
          <div className="bg-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Background video"
            >
              <source
                src={process.env.NEXT_PUBLIC_BG_VIDEO_URL}
                type="video/mp4"
              />
            </video>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
