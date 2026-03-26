-- Run this in the Supabase SQL editor before deploying the book waitlist feature.
-- Dashboard: https://supabase.com/dashboard/project/lgcscbckmngfeyjkgbqx/sql

create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  list text not null check (list in ('book', 'newsletter')),
  created_at timestamptz default now(),
  unique (email, list)
);

-- Optional: enable RLS (the API uses the anon key, so allow inserts + selects from service role only)
alter table subscribers enable row level security;

-- Allow the server-side API to read and insert (anon key is used server-side only, never exposed to browser)
create policy "Allow server inserts" on subscribers
  for insert with check (true);

create policy "Allow server reads" on subscribers
  for select using (true);
