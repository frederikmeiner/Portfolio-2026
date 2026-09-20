-- To huller omkring ejeren af ønskelisten.

-- 1) Ejerens adresser kunne hentes af alle: Supabase giver som standard
--    execute på nye funktioner til anon og authenticated, så et anonymt kald
--    til /rest/v1/rpc/wishlist_owner_emails udleverede begge adresser.
--    is_wishlist_owner() er security definer og kan stadig læse dem.
revoke execute on function public.wishlist_owner_emails() from public, anon, authenticated;

-- 2) Ejeren kunne aflure hvad der var reserveret. reserved_wish_ids() skjuler
--    listen, men insert-policyen lod ejeren forsøge at reservere — og et taget
--    ønske svarer med unik-fejlen 23505. RLS tjekkes før unik-indekset, så med
--    denne policy får ejeren samme afvisning på alle ønsker, taget eller ej.
--    Ejeren kunne også spærre sine egne ønsker for gæsterne. Følger samme
--    toggle som resten: med skjul slået fra kan ejeren teste som gæst.
drop policy if exists "insert own" on public.reservations;

create policy "insert own" on public.reservations
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and not (public.wishlist_hide_from_owner() and public.is_wishlist_owner())
  );
