import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frederik Meiner",
  description: "Senior Frontend Developer — Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
