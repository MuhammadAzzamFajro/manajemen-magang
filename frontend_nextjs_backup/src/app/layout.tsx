import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Management Magang",
  description: "Platform untuk mengelola magang siswa SMK",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
