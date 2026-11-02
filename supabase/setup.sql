-- Run this entire file in Supabase Dashboard > SQL Editor.
create table if not exists public.learning_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"activeDates":[],"tasks":[],"revs":[],"back":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learning_states enable row level security;
revoke all on table public.learning_states from anon, authenticated;
grant select, insert, update, delete on table public.learning_states to authenticated;

drop policy if exists "Users read own learning state" on public.learning_states;
create policy "Users read own learning state"
on public.learning_states for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own learning state" on public.learning_states;
create policy "Users insert own learning state"
on public.learning_states for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own learning state" on public.learning_states;
create policy "Users update own learning state"
on public.learning_states for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own learning state" on public.learning_states;
create policy "Users delete own learning state"
on public.learning_states for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists learning_states_updated_at_idx
on public.learning_states(updated_at desc);
