import type { Metadata } from "next";
import ProjectsPage from "@/components/pages/ProjectsPage";

export const metadata: Metadata = {
  title: "Projekter",
  description: "Udvalgte projekter — web, integrationer og AI-agenter."
};

export default function Page() {
  return <ProjectsPage profile="recruiter" />;
}
