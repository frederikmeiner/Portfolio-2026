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
import Snowfall from "@/components/christmas/Snowfall";
import { PROFILES, cardHref, type CardSpec, type ProfileId, type RowSpec } from "@/lib/profiles";
import { christmasCountdown, isChristmasSeason } from "@/lib/season";

const XMAS_GRADIENT = "linear-gradient(135deg, #14532d 0%, #b91c1c 100%)";

/** I julesæsonen bliver ønskeliste-kortet til juleønsker. */
function seasonal(card: CardSpec, christmas: boolean): CardSpec {
  if (!christmas || !("page" in card) || card.page !== "wishlist") return card;
  return { ...card, title: "Juleønsker", description: "Reservér en julegave — så I ikke køber det samme", gradient: XMAS_GRADIENT };
}

const EXTRAS = {
  anbefalinger: AnbefalingerCard,
  certifications: CertificationsCard,
} as const;

function Row({ row, profile, christmas }: { row: RowSpec; profile: ProfileId; christmas: boolean }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2
        className="px-5 md:px-16 mb-6 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {row.title}
      </h2>
      <ContentRow title="">
        {row.cards.map((c) => seasonal(c, christmas)).map((card) => (
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
  // Kun familie-forsiden får julen — arbejdsprofilerne forbliver neutrale.
  const christmas = home.hero === "wishlist" && isChristmasSeason();

  return (
    <div className={christmas ? "theme-christmas" : undefined} style={{ background: "var(--background)", minHeight: "100vh" }}>
      {christmas && <Snowfall />}
      <NetflixNav profile={profile} />
      <main>
      {home.hero === "wishlist" ? (
        <FamilyHero media={heroMedia} christmas={christmas} countdown={christmas ? christmasCountdown() : null} />
      ) : (
        <HeroSection profileLabel={label} media={heroMedia} />
      )}

      <div className="pt-8 pb-24">
        {home.rows.map((row, i) => (
          <div key={row.title}>
            <Row row={row} profile={profile} christmas={christmas} />
            {/* Besøgerens egen historik ligger lige under den første række, som på Netflix. */}
            {i === 0 && <ContinueWatchingRow profile={profile} />}
            {i === 0 && <BecauseYouWatchedRow profile={profile} projects={cardProjects} />}
            {i === 0 && <TopTenRow profile={profile} projects={projects} />}
          </div>
        ))}
      </div>
      </main>
    </div>
  );
}
