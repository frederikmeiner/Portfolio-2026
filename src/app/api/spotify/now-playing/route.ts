import { getNowPlaying, getRecentlyPlayed } from "@/lib/spotify";

export const revalidate = 0;

export async function GET() {
  const res = await getNowPlaying();

  if (res.status === 204 || res.status > 400) {
    // Ikke noget i gang — vis sidst afspillede
    const recentRes = await getRecentlyPlayed(1);
    if (!recentRes.ok) return Response.json({ isPlaying: false });
    const recent = await recentRes.json();
    const track = recent.items?.[0]?.track;
    if (!track) return Response.json({ isPlaying: false });
    return Response.json({
      isPlaying: false,
      title: track.name,
      artist: track.artists.map((a: { name: string }) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
    });
  }

  const song = await res.json();
  if (!song?.item) return Response.json({ isPlaying: false });

  return Response.json({
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map((a: { name: string }) => a.name).join(", "),
    album: song.item.album.name,
    albumArt: song.item.album.images[0]?.url,
    songUrl: song.item.external_urls.spotify,
  });
}
