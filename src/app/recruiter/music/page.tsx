import SubPageLayout from "@/components/netflix/SubPageLayout";
import SpotifyPlayer from "@/components/spotify/SpotifyPlayer";
import SpotifyTopTracks from "@/components/spotify/SpotifyTopTracks";
import SpotifyTopArtists from "@/components/spotify/SpotifyTopArtists";

export default function RecruiterMusicPage() {
  return (
    <SubPageLayout title="Musik" backHref="/recruiter" backLabel="Rekrutterer">
      <div className="max-w-3xl flex flex-col gap-12">
        <SpotifyPlayer />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <SpotifyTopTracks />
          <SpotifyTopArtists />
        </div>
      </div>
    </SubPageLayout>
  );
}
