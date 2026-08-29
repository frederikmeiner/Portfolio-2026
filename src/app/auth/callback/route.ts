import { NextResponse } from "next/server";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // Kun relative paths, så callback ikke kan bruges som open redirect.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code && isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
