const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

/**
 * Token og svar huskes i processen i stedet for i Next's fetch-cache. Den cache
 * har Authorization-headeren med i nøglen, og der blev hentet et nyt token ved
 * hvert kald — så den ramte aldrig, men skrev en ny fil til disken hver gang
 * afspilleren pollede. Serveren kører som én proces, så et Map er nok.
 */
let token: { value: string; expires: number } | null = null;
const memo = new Map<string, { expires: number; data: unknown }>();

async function getAccessToken(): Promise<string | null> {
  if (token && Date.now() < token.expires) return token.value;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.access_token) return null;
  // Forny et minut før tid, så et token ikke udløber midt i et kald.
  token = { value: data.access_token, expires: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000 };
  return token.value;
}

/**
 * Henter fra Spotifys Web API. Giver null ved alt andet end et brugbart svar —
 * 204 (intet spiller), 401, 429, netværksfejl — så ruterne kan falde tilbage
 * i stedet for at vælte. Kun gode svar huskes.
 */
async function spotifyGet<T>(path: string, ttlSeconds: number): Promise<T | null> {
  const hit = memo.get(path);
  if (hit && Date.now() < hit.expires) return hit.data as T;

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const res = await fetch(`https://api.spotify.com/v1${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (res.status === 401) token = null;
    if (!res.ok || res.status === 204) return null;

    const data = (await res.json()) as T;
    memo.set(path, { expires: Date.now() + ttlSeconds * 1000, data });
    return data;
  } catch {
    return null;
  }
}

export type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
  duration_ms: number;
};

export type SpotifyArtist = {
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
  genres?: string[];
  followers?: { total: number };
};

// item er null, når det der spiller ikke er et nummer (podcast, reklame).
export function getNowPlaying() {
  return spotifyGet<{ is_playing: boolean; item: SpotifyTrack | null }>("/me/player/currently-playing", 10);
}

export function getRecentlyPlayed(limit = 6) {
  return spotifyGet<{ items?: { track: SpotifyTrack }[] }>(`/me/player/recently-played?limit=${limit}`, 60);
}

export function getTopArtists(limit = 8) {
  return spotifyGet<{ items?: SpotifyArtist[] }>(`/me/top/artists?limit=${limit}&time_range=short_term`, 3600);
}

export function getTopTracks(limit = 8) {
  return spotifyGet<{ items?: SpotifyTrack[] }>(`/me/top/tracks?limit=${limit}&time_range=short_term`, 3600);
}

type TrackLike = { name: string; artists: { name: string }[] };

/**
 * Numre der aldrig skal vises på siden, uanset hvor meget de er spillet.
 * Matcher på titel og kunstner uden hensyn til store/små bogstaver.
 */
const HIDDEN_TRACKS: { title: string; artist: string }[] = [
  { title: "she forgot that i existed", artist: "Josiah MacCartney" },
  { title: "tell u i'm sorry", artist: "Seon" },
];

const norm = (s: string) => s.trim().toLowerCase();

export function isHiddenTrack(track: TrackLike) {
  const title = norm(track.name);
  const artists = track.artists.map((a) => norm(a.name));
  return HIDDEN_TRACKS.some((h) => norm(h.title) === title && artists.includes(norm(h.artist)));
}
