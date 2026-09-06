"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isProfileId } from "@/lib/profiles";
import { readHistory, recordVisit, writeHistory } from "@/lib/watch-history";

type Props = { title: string; image?: string };

/** Usynlig. Registrerer besøget og opdaterer scroll-progress i historikken for profilen i URL'en. */
export default function TrackVisit({ title, image }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    const profile = pathname.split("/")[1];
    if (!isProfileId(profile)) return;

    const measure = () => {
      const total = document.documentElement.scrollHeight;
      return total <= 0 ? 1 : (window.scrollY + window.innerHeight) / total;
    };
    const save = () =>
      writeHistory(
        profile,
        recordVisit(readHistory(profile), { href: pathname, title, image, progress: measure(), at: Date.now() })
      );

    save();

    // Throttlet: højst én skrivning pr. 250 ms mens der scrolles.
    let timer: number | null = null;
    const onScroll = () => {
      if (timer !== null) return;
      timer = window.setTimeout(() => {
        timer = null;
        save();
      }, 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [pathname, title, image]);

  return null;
}
