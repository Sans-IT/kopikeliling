SELECT p.full_name, r.latitude, r.longitude, r.is_online, r.work_start_time
FROM profiles p
JOIN riders r ON p.id = r.id;