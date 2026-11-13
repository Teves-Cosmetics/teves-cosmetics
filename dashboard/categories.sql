create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "public read categories" on public.categories for select using (true);
create policy "authenticated manage categories" on public.categories for all to authenticated using (true) with check (true);
insert into public.categories (name,slug,sort_order) values
('العناية بالبشرة','skincare',1),('العناية بالشعر','haircare',2),('الجمال','beauty',3),('طبيعي','natural',4)
on conflict (slug) do nothing;
