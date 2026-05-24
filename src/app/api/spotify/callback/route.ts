import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  const data = await res.json();

  // Vis refresh token så det kan kopieres til .env.local
  return new NextResponse(
    `<html><body style="font-family:monospace;padding:2rem;background:#141414;color:#fafafa;">
      <h2>✓ Spotify forbundet</h2>
      <p>Kopiér denne linje til din <strong>.env.local</strong>:</p>
      <pre style="background:#1f1f1f;padding:1rem;border-radius:8px;word-break:break-all;">SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
      <p style="color:#a1a1aa;">Genstart derefter dev-serveren.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
