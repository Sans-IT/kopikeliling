-- 1. Masukkan Profile dengan ID Random
DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
    coffee_cat_id uuid;
    item_id uuid;
BEGIN
    -- Masukkan Profile
    INSERT INTO profiles (id, full_name, role)
    VALUES (new_user_id, 'Rider Dummy Test', 'RIDER')
    RETURNING id INTO new_user_id;

    -- Masukkan Kategori
    INSERT INTO menu_categories (name, sort_order)
    VALUES ('Coffee', 1)
    RETURNING id INTO coffee_cat_id;

    -- Masukkan Menu
    INSERT INTO menu_items (name, price, category_id, is_available)
    VALUES ('Kopi Test', 10000, coffee_cat_id, true)
    RETURNING id INTO item_id;

    -- Masukkan Inventory
    INSERT INTO rider_inventory (rider_id, menu_item_id, quantity)
    VALUES (new_user_id, item_id, 50);

    RAISE NOTICE 'Berhasil buat data dummy dengan User ID: %', new_user_id;
END $$;