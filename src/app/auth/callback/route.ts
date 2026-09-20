import { NextResponse } from "next/server";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Kun stier på vores eget domæne, så callback ikke kan bruges som open redirect.
 * Et tjek på selve strengen er ikke nok: browsere læser "\" som "/" og fjerner
 * tab og linjeskift, så "/\evil.com" og "/<tab>/evil.com" ender på evil.com.
 * Derfor opløses stien som en browser ville gøre det, og origin skal stå fast.
 */
function safePath(next: string | null) {
  if (!next?.startsWith("/")) return "/";
  try {
    const base = "http://internal";
    const url = new URL(next, base);
    // "/..//evil.com" holder origin, men normaliseres til stien "//evil.com".
    if (url.origin !== base || url.pathname.startsWith("//")) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const safeNext = safePath(searchParams.get("next"));

  let failed = false;
  if (code && isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
  }

  // Relativ Location med vilje: bag nginx er request.url's origin Next's egen
  // lytteadresse (https://localhost:3001), ikke det domæne brugeren står på.
  // Browseren opløser en relativ Location mod den rigtige adresse.
  // En udløbet kode, eller et link åbnet i en anden browser, landede før på
  // siden som udlogget uden forklaring. Siden viser beskeden ud fra ?login=fejl.
  const location = failed ? `${safeNext.split(/[?#]/)[0]}?login=fejl` : safeNext;
  return new NextResponse(null, { status: 302, headers: { Location: location } });
}
