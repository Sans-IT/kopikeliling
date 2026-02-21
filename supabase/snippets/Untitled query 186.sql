-- Hapus semua tabel di schema 'public'
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Hapus semua enum custom (seperti order_status dan user_role)
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.r_name) || ' CASCADE';
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        -- Jika query enum di atas gagal karena versi Postgres, gunakan cara manual di bawah
        NULL;
END $$;