import { NextResponse } from "next/server";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
].join(" ");

export function GET() {
  // Engangsopsætning, der kun giver mening lokalt — redirect_uri peger på 127.0.0.1.
  if (process.env.NODE_ENV === "production") return new NextResponse(null, { status: 404 });

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: scopes,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
