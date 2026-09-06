import { NextResponse } from "next/server";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // Kun relative paths, så callback ikke kan bruges som open redirect.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code && isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Relativ Location med vilje: bag nginx er request.url's origin Next's egen
  // lytteadresse (https://localhost:3001), ikke det domæne brugeren står på.
  // Browseren opløser en relativ Location mod den rigtige adresse.
  return new NextResponse(null, { status: 302, headers: { Location: safeNext } });
}
