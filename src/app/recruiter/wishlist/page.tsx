import SubPageLayout from "@/components/netflix/SubPageLayout";
import WishlistGrid from "@/components/cards/WishlistGrid";
import { getWishlist } from "@/lib/sanity/queries";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RecruiterWishlistPage() {
  const items = await getWishlist();
  const authReady = isSupabaseConfigured();

  let user: { id: string; name: string } | null = null;
  let isOwner = false;
  let reservedIds: string[] = [];
  let myIds: string[] = [];

  if (authReady) {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      user = {
        id: data.user.id,
        name:
          (data.user.user_metadata?.full_name as string | undefined) ??
          data.user.email ??
          "Gæst",
      };

      // Databasen afgør hvad der udleveres — inklusive om ejeren skal skånes.
      const [{ data: owner }, { data: taken }, { data: mine }] = await Promise.all([
        supabase.rpc("is_wishlist_owner"),
        supabase.rpc("reserved_wish_ids"),
        supabase.from("reservations").select("wish_id"),
      ]);

      isOwner = owner === true;
      reservedIds = (taken as string[] | null) ?? [];
      myIds = (mine ?? []).map((r: { wish_id: string }) => r.wish_id);
    }
  }

  return (
    <SubPageLayout title="Ønskeliste" backHref="/recruiter" backLabel="Rekrutterer">
      <WishlistGrid
        items={items}
        authReady={authReady}
        user={user}
        isOwner={isOwner}
        reservedIds={reservedIds}
        myIds={myIds}
      />
    </SubPageLayout>
  );
}
