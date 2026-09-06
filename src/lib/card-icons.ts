import { Briefcase, Gift, Lightbulb, Mail, Music, Rocket, Zap, type LucideIcon } from "lucide-react";
import type { IconName } from "@/lib/profiles";

/** profiles.ts kender kun navne, så den kan testes uden React — her bliver de til ikoner. */
export const CARD_ICONS: Record<IconName, LucideIcon> = {
  zap: Zap,
  rocket: Rocket,
  briefcase: Briefcase,
  mail: Mail,
  music: Music,
  lightbulb: Lightbulb,
  gift: Gift,
};
