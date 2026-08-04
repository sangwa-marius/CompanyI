import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandFont = Outfit({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Companyi - Manage Companies, Employees, Departments & Projects",
  description:
    "Companyi is a modern enterprise management platform that helps you organize companies, manage employees, structure departments, and track projects in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${brandFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background-alt text-text">
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
