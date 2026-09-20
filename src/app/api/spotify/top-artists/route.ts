import { getTopArtists } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getTopArtists(8);

  const artists = (data?.items ?? []).map((artist) => ({
    name: artist.name,
    image: artist.images[0]?.url,
    url: artist.external_urls.spotify,
    genres: artist.genres?.slice(0, 2) ?? [],
    followers: artist.followers?.total ?? 0,
  }));

  return Response.json({ artists });
}
