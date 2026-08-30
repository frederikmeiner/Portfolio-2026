import type { Metadata } from "next";
import SkillsPage from "@/components/pages/SkillsPage";

export const metadata: Metadata = {
  title: "Skills",
  description: "Teknologier og værktøjer jeg arbejder i til daglig."
};

export default function Page() {
  return <SkillsPage profile="recruiter" />;
}
