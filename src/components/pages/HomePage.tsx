import NetflixNav from "@/components/netflix/NetflixNav";
import HeroSection from "@/components/netflix/HeroSection";
import FamilyHero from "@/components/netflix/FamilyHero";
import ContentRow from "@/components/netflix/ContentRow";
import ContinueWatchingRow from "@/components/netflix/ContinueWatchingRow";
import TopTenRow from "@/components/netflix/TopTenRow";
import BecauseYouWatchedRow from "@/components/netflix/BecauseYouWatchedRow";
import { getProjects } from "@/lib/sanity/queries";
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
export default async function HomePage({ profile }: { profile: ProfileId }) {
  const { label, heroMedia, home } = PROFILES[profile];
  // Hentes én gang og deles af de rækker, der viser projekter.
  const projects = await getProjects();
  // Rækken regnes ud i browseren, så listen sendes med siden — uden beskrivelserne,
  // som kortene ikke viser, og som er det meste af vægten.
  const cardProjects = projects.map((project) => ({ ...project, description: undefined }));

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <NetflixNav profile={profile} />
      {home.hero === "wishlist" ? (
        <FamilyHero media={heroMedia} />
      ) : (
        <HeroSection profileLabel={label} media={heroMedia} />
      )}

      <div className="pt-8 pb-24">
        {home.rows.map((row, i) => (
          <div key={row.title}>
            <Row row={row} profile={profile} />
            {/* Besøgerens egen historik ligger lige under den første række, som på Netflix. */}
            {i === 0 && <ContinueWatchingRow profile={profile} />}
            {i === 0 && <BecauseYouWatchedRow profile={profile} projects={cardProjects} />}
            {i === 0 && <TopTenRow profile={profile} projects={projects} />}
          </div>
        ))}
      </div>
    </div>
  );
}
