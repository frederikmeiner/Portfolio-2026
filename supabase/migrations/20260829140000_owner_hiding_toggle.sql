-- Skjul-for-ejer er slået TIL: Frederik ser ingen reservationer.
--
-- Slå fra under udvikling ved at ændre `true` til `false` herunder og køre filen igen.
-- Alt andet — RLS, hvem-der-reserverede, unik-constraint — er upåvirket og altid aktivt.

create or replace function public.wishlist_hide_from_owner()
returns boolean
language sql
immutable
as $$
  select true
$$;

create or replace function public.reserved_wish_ids()
returns setof text
language sql
security definer
set search_path = public
stable
as $$
  select wish_id from public.reservations
  where not (public.wishlist_hide_from_owner() and public.is_wishlist_owner())
$$;

grant execute on function public.wishlist_hide_from_owner() to authenticated;
revoke execute on function public.reserved_wish_ids() from public, anon;
grant execute on function public.reserved_wish_ids() to authenticated;
