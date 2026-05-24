import { getTopTracks } from "@/lib/spotify";

export const revalidate = 3600;

export async function GET() {
  const res = await getTopTracks(8);
  if (!res.ok) return Response.json({ tracks: [] });
  const data = await res.json();

  const tracks = data.items?.map((track: {
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
    external_urls: { spotify: string };
    duration_ms: number;
  }) => ({
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
    duration: track.duration_ms,
  }));

  return Response.json({ tracks });
}
