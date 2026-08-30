import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Rekrutterer",
    template: "%s — Frederik Meiner",
  },
  description: "Erfaring, projekter og kompetencer — set med rekruttererens briller.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
