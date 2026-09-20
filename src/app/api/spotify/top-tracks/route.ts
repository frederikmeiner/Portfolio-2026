import { getTopTracks, isHiddenTrack } from "@/lib/spotify";

export const dynamic = "force-dynamic";

const LIMIT = 8;

export async function GET() {
  // Hent lidt flere end vi viser, så listen stadig er fuld efter bortfiltrering.
  const data = await getTopTracks(LIMIT + 4);

  const tracks = (data?.items ?? [])
    .filter((t) => !isHiddenTrack(t))
    .slice(0, LIMIT)
    .map((track) => ({
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
      duration: track.duration_ms,
    }));

  return Response.json({ tracks });
}
