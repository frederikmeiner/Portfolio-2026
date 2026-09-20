-- Visninger pr. projekt — fodrer "Top 10"-rækken på forsiden.
--
-- Tabellen har RLS uden policies, så ingen kan læse eller skrive direkte.
-- Al adgang går gennem de to funktioner herunder.

create table if not exists public.project_views (
  slug       text primary key,
  views      bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.project_views enable row level security;

-- Tæller én visning. Kaldes fra browseren af alle, også uden login, så den
-- er bevidst snæver: kun slug-formede navne, og højst 500 forskellige — ellers
-- kunne hvem som helst fylde tabellen med vrøvl via REST-API'et.
create or replace function public.track_project_view(p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_slug is null or p_slug !~ '^[a-z0-9][a-z0-9-]{0,95}$' then
    return;
  end if;

  update public.project_views
     set views = views + 1, updated_at = now()
   where slug = p_slug;

  if not found and (select count(*) from public.project_views) < 500 then
    insert into public.project_views (slug, views) values (p_slug, 1)
    on conflict (slug) do update set views = public.project_views.views + 1, updated_at = now();
  end if;
end;
$$;

-- De mest sete. Stable, så den kan kaldes med GET og caches af Next.
create or replace function public.top_project_slugs(p_limit int default 10)
returns table (slug text, views bigint)
language sql
stable
security definer
set search_path = public
as $$
  select slug, views
    from public.project_views
   order by views desc, updated_at desc
   limit least(greatest(p_limit, 1), 50)
$$;

revoke execute on function public.track_project_view(text) from public;
revoke execute on function public.top_project_slugs(int) from public;
grant execute on function public.track_project_view(text) to anon, authenticated;
grant execute on function public.top_project_slugs(int) to anon, authenticated;
