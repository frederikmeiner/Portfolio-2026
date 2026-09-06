const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString("base64");

async function getAccessToken() {
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
    next: { revalidate: 0 },
  });
  return res.json();
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken();
  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${access_token}` },
    next: { revalidate: 0 },
  });
}

export async function getRecentlyPlayed(limit = 6) {
  const { access_token } = await getAccessToken();
  return fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
      next: { revalidate: 60 },
    }
  );
}

export async function getTopArtists(limit = 8) {
  const { access_token } = await getAccessToken();
  return fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=short_term`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
      next: { revalidate: 3600 },
    }
  );
}

export async function getTopTracks(limit = 8) {
  const { access_token } = await getAccessToken();
  return fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=short_term`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
      next: { revalidate: 3600 },
    }
  );
}

type TrackLike = { name: string; artists: { name: string }[] };

/**
 * Numre der aldrig skal vises på siden, uanset hvor meget de er spillet.
 * Matcher på titel og kunstner uden hensyn til store/små bogstaver.
 */
const HIDDEN_TRACKS: { title: string; artist: string }[] = [
  { title: "she forgot that i existed", artist: "Josiah MacCartney" },
];

const norm = (s: string) => s.trim().toLowerCase();

export function isHiddenTrack(track: TrackLike) {
  const title = norm(track.name);
  const artists = track.artists.map((a) => norm(a.name));
  return HIDDEN_TRACKS.some((h) => norm(h.title) === title && artists.includes(norm(h.artist)));
}
