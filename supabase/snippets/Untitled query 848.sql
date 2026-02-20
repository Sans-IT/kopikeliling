-- Izinkan semua orang (termasuk Guest) untuk melihat lokasi rider
CREATE POLICY "Enable read access for all users" 
ON public.riders_location FOR SELECT 
USING (true);

-- Izinkan semua orang melihat profil untuk join data nama
CREATE POLICY "Enable read access for profiles" 
ON public.profiles FOR SELECT 
USING (true);