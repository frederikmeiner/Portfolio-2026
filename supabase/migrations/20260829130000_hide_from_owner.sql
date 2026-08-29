-- Skjuler reservationer helt for ønskelistens ejer, så overraskelsen bevares.
-- Uden dette kunne ejeren se HVILKE gaver der var taget (men ikke af hvem).

create or replace function public.wishlist_owner_email()
returns text
language sql
immutable
as $$
  select 'frederik.meiner@gmail.com'
$$;

create or replace function public.is_wishlist_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = lower(public.wishlist_owner_email()),
    false
  )
$$;

-- Udleverer hvilke gaver der er taget — men returnerer ingenting til ejeren.
create or replace function public.reserved_wish_ids()
returns setof text
language sql
security definer
set search_path = public
stable
as $$
  select wish_id from public.reservations
  where not public.is_wishlist_owner()
$$;

grant execute on function public.is_wishlist_owner() to authenticated;
revoke execute on function public.reserved_wish_ids() from public, anon;
grant execute on function public.reserved_wish_ids() to authenticated;
