import SubPageLayout from "@/components/netflix/SubPageLayout";
import InspirationBento from "@/components/cards/InspirationBento";
import { getInspiration } from "@/lib/sanity/queries";

export default async function RecruiterInspirationPage() {
  const items = await getInspiration();

  return (
    <SubPageLayout title="Inspiration" backHref="/recruiter" backLabel="Rekrutterer">


      {items.length === 0 ? (
        <div
          className="flex items-center justify-center rounded-2xl py-24"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            Tilføj inspiration i Sanity Studio → /studio
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          style={{ gridAutoRows: "200px", gridAutoFlow: "dense" }}
        >
          {items.map((item, i) => (
            <InspirationBento key={item._id} item={item} index={i} />
          ))}
        </div>
      )}
    </SubPageLayout>
  );
}
