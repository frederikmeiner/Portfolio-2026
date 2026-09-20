"use client";

import { useEffect } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Usynlig. Tæller én visning af projektet pr. browser-session — fodrer Top 10 på forsiden. */
export default function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Uden sessionStorage kan genbesøg ikke kendes fra nye — tæl hellere for lidt.
      return;
    }
    // Fejl ignoreres: en tabt visning må aldrig kunne ses af den besøgende.
    getBrowserSupabase()
      .rpc("track_project_view", { p_slug: slug })
      .then(() => {}, () => {});
  }, [slug]);

  return null;
}
