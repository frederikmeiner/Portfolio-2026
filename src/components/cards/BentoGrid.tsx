import BentoCard from "@/components/cards/BentoCard";
import type { BentoItem } from "@/lib/sanity/queries";

type Props = {
  items: BentoItem[];
  emptyText?: string;
};

export default function BentoGrid({ items, emptyText = "Tilføj indhold i Sanity Studio → /studio" }: Props) {
  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl py-24"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          {emptyText}
        </p>
      </div>
    );
  }

  return (
    // `dense` fylder hullerne ud: når et 2×2-felt ikke kan være i de resterende
    // kolonner, rykker et senere 1×1-felt op i det tomrum, det ellers ville efterlade.
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      style={{ gridAutoRows: "200px", gridAutoFlow: "dense" }}
    >
      {items.map((item, i) => (
        <BentoCard key={item._id} item={item} index={i} />
      ))}
    </div>
  );
}
