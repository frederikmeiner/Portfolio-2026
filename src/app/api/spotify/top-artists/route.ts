import { getTopArtists } from "@/lib/spotify";

export const revalidate = 3600;

export async function GET() {
  const res = await getTopArtists(8);
  if (!res.ok) return Response.json({ artists: [] });
  const data = await res.json();

  const artists = data.items?.map((artist: {
    name: string;
    images: { url: string }[];
    external_urls: { spotify: string };
    genres: string[];
    followers: { total: number };
  }) => ({
    name: artist.name,
    image: artist.images[0]?.url,
    url: artist.external_urls.spotify,
    genres: artist.genres?.slice(0, 2) ?? [],
    followers: artist.followers?.total ?? 0,
  }));

  return Response.json({ artists: artists ?? [] });
}
