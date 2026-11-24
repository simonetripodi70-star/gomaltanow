-- Traduzioni dei contenuti (luoghi, articoli, guide, testi delle pagine)
create table if not exists public.translations (
  kind text not null,          -- place | article | guide | ui
  ref text not null,           -- slug del luogo/articolo, chiave guida o pagina
  lang text not null,          -- it | pl | fr | de | es | uk
  source_hash text not null,   -- hash del testo inglese tradotto
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (kind, ref, lang)
);

alter table public.translations enable row level security;

drop policy if exists "Public can read translations" on public.translations;
create policy "Public can read translations"
  on public.translations for select
  using (true);

select count(*) from public.translations;
