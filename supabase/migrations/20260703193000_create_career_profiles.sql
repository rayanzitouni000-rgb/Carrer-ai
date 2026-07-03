-- Table profil carrière liée à auth.users (Phase 2 sync cloud)
create table if not exists career_profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  profile_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table career_profiles enable row level security;

create policy "Users can view own profile"
  on career_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on career_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on career_profiles for update
  using (auth.uid() = user_id);
