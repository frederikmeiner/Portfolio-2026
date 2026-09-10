-- Ejeren kan logge ind med flere adresser (Google + e-mail-kode). Alle skal
-- behandles som ejer, så reservationer forbliver skjult uanset login-metode.

create or replace function public.wishlist_owner_emails()
returns text[]
language sql
immutable
as $$
  select array['frederik.meiner@gmail.com', 'frederik.meiner@outlook.dk']
$$;

create or replace function public.is_wishlist_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = any (public.wishlist_owner_emails()),
    false
  )
$$;

drop function if exists public.wishlist_owner_email();

grant execute on function public.is_wishlist_owner() to authenticated;
