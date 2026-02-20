-- 1. Hapus yang lama jika ada
drop trigger if exists on_auth_user_created on auth.users;

-- 2. Buat fungsi dengan path yang jelas
create or replace function public.handle_new_user()
returns trigger 
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    'GUEST'
  );
  return new;
end;
$$ language plpgsql;

-- 3. Pasang trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();