-- Corrige upsert UPDATE (WITH CHECK requis pour RLS)
drop policy if exists "Users can update own profile" on career_profiles;

create policy "Users can update own profile"
  on career_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
