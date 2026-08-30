import type { Metadata } from "next";
import InspirationPage from "@/components/pages/InspirationPage";

export const metadata: Metadata = {
  title: "Inspiration",
  description: "Det jeg følger med i og henter inspiration fra."
};

export default function Page() {
  return <InspirationPage profile="recruiter" />;
}
