import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  // Only serif résumé templates use it; load on demand instead of on every page.
  preload: false,
});

export const metadata: Metadata = {
  title: "Opti — AI Resume Optimizer",
  description:
    "Tailor your resume to any job description with ATS-friendly formatting.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
