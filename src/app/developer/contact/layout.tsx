import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kom i kontakt med Frederik Meiner.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
