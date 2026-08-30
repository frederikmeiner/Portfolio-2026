import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Udvikler",
    template: "%s — Frederik Meiner",
  },
  description: "Stak, kode og projekter — set med udviklerens briller.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
