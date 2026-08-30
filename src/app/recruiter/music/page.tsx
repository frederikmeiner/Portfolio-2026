import type { Metadata } from "next";
import MusicPage from "@/components/pages/MusicPage";

export const metadata: Metadata = {
  title: "Musik",
  description: "Hvad der spiller på Spotify lige nu."
};

export default function Page() {
  return <MusicPage profile="recruiter" />;
}
