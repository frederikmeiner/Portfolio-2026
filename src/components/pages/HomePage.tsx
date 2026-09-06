import NetflixNav from "@/components/netflix/NetflixNav";
import HeroSection from "@/components/netflix/HeroSection";
import FamilyHero from "@/components/netflix/FamilyHero";
import ContentRow from "@/components/netflix/ContentRow";
import CategoryCard from "@/components/cards/CategoryCard";
import AnbefalingerCard from "@/components/cards/AnbefalingerCard";
import CertificationsCard from "@/components/cards/CertificationsCard";
import { PROFILES, cardHref, type ProfileId, type RowSpec } from "@/lib/profiles";

const EXTRAS = {
  anbefalinger: AnbefalingerCard,
  certifications: CertificationsCard,
} as const;

function Row({ row, profile }: { row: RowSpec; profile: ProfileId }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2
        className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {row.title}
      </h2>
      <ContentRow title="">
        {row.cards.map((card) => (
          <CategoryCard
            key={card.title}
            title={card.title}
            description={card.description}
            gradient={card.gradient}
            icon={card.icon}
            href={cardHref(card, profile)}
          />
        ))}
        {row.extras?.map((extra) => {
          const Extra = EXTRAS[extra];
          return <Extra key={extra} />;
        })}
      </ContentRow>
    </div>
  );
}

/** Forsiden for enhver profil — hvad den viser står i profiles.ts, ikke her. */
export default function HomePage({ profile }: { profile: ProfileId }) {
  const { label, heroMedia, home } = PROFILES[profile];

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <NetflixNav profile={profile} />
      {home.hero === "wishlist" ? (
        <FamilyHero media={heroMedia} />
      ) : (
        <HeroSection profileLabel={label} media={heroMedia} />
      )}

      <div className="pt-8 pb-24">
        {home.rows.map((row) => (
          <Row key={row.title} row={row} profile={profile} />
        ))}
      </div>
    </div>
  );
}
