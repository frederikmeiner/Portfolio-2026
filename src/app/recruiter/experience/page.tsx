import type { Metadata } from "next";
import ExperiencePage from "@/components/pages/ExperiencePage";

export const metadata: Metadata = {
  title: "Erfaring",
  description: "5+ års professionel webudvikling — fra junior til senior frontend developer.",
};

export default function Page() {
  return <ExperiencePage profile="recruiter" />;
}
