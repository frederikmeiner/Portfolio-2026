import { getNowPlaying, getRecentlyPlayed, type SpotifyTrack } from "@/lib/spotify";

export const dynamic = "force-dynamic";

function toJson(track: SpotifyTrack, isPlaying: boolean) {
  return Response.json({
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
  });
}

export async function GET() {
  const song = await getNowPlaying();
  if (song?.item) return toJson(song.item, song.is_playing);

  // Intet nummer i gang — heller ikke ved podcast, reklame eller fejl hos
  // Spotify — så vis det sidst afspillede.
  const recent = await getRecentlyPlayed(1);
  const track = recent?.items?.[0]?.track;
  return track ? toJson(track, false) : Response.json({ isPlaying: false });
}
