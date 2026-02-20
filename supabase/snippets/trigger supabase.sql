-- 1. Buat Fungsi yang akan dijalankan saat user baru terdaftar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'User Baru'), 
    new.raw_user_meta_data->>'avatar_url',
    'GUEST' -- Role default sesuai enum kamu
  );
  RETURN NEW;
END;
$$;

-- 2. Buat Pemicu (Trigger) yang menghubungkan auth.users ke fungsi di atas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();