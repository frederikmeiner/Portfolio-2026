-- Ønskeliste-reservationer.

create table if not exists public.reservations (
  id         uuid primary key default gen_random_uuid(),
  wish_id    text not null unique,          -- Sanity _id på wish-dokumentet. UNIQUE = kun én reservation pr. gave.
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;

-- Man kan kun se, oprette og slette SINE EGNE reservationer.
create policy "select own" on public.reservations
  for select to authenticated using (user_id = auth.uid());

create policy "insert own" on public.reservations
  for insert to authenticated with check (user_id = auth.uid());

create policy "delete own" on public.reservations
  for delete to authenticated using (user_id = auth.uid());

-- Udleverer KUN hvilke gaver der er taget — aldrig af hvem.
-- security definer omgår RLS, men select'er kun wish_id.
create or replace function public.reserved_wish_ids()
returns setof text
language sql
security definer
set search_path = public
stable
as $$
  select wish_id from public.reservations
$$;

revoke execute on function public.reserved_wish_ids() from public, anon;
grant execute on function public.reserved_wish_ids() to authenticated;
