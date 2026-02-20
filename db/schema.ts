import {
  pgTable,
  text,
  timestamp,
  uuid,
  decimal,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// ---- Enums ----

export const userRoleEnum = pgEnum("user_role", ["GUEST", "ADMIN", "RIDER"]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING", // Baru pesan, belum diproses
  "ON_QUEUE", // Dalam antrian / sedang diproses
  "SUCCESS", // Selesai
  "CANCELLED", // Dibatalkan
]);

// ---- Profiles (Supabase Auth) ----
// User biasa default GUEST, bisa di-upgrade jadi ADMIN atau RIDER
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("GUEST").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---- Rider location (untuk realtime nanti) ----

export const ridersLocation = pgTable("riders_location", {
  id: uuid("id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---- Kategori menu (custom, user/admin bisa tambah sendiri) ----
export const menuCategories = pgTable("menu_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdBy: uuid("created_by").references(() => profiles.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").defaultNow(),
});

// ---- Menu items (pakai kategori custom) ----

export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  categoryId: uuid("category_id").references(() => menuCategories.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---- Orders (state: PENDING → ON_QUEUE → SUCCESS / CANCELLED) ----

// Realtime: subscribe ke tabel ini untuk notif/callback saat user pesan
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  riderId: uuid("rider_id").references(() => profiles.id, {
    onDelete: "set null",
  }),

  status: orderStatusEnum("status").default("PENDING").notNull(),
  totalPrice: integer("total_price").notNull(),
  // Untuk notif: bisa simpan device token / channel di sini atau tabel terpisah
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---- Order items (detail per order) ----

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: uuid("menu_item_id")
    .notNull()
    .references(() => menuItems.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),

  priceAtOrder: integer("price_at_order").notNull(), // Harga saat order (snapshot)
});

// ---- Relations (untuk query join / type-safe) ----

export const profilesRelations = relations(profiles, ({ many, one }) => ({
  orders: many(orders, { relationName: "orderUser" }),
  ordersAsRider: many(orders, { relationName: "orderRider" }),
  ridersLocation: one(ridersLocation),
  menuCategoriesCreated: many(menuCategories),
}));

export const ridersLocationRelations = relations(ridersLocation, ({ one }) => ({
  profile: one(profiles),
}));

export const menuCategoriesRelations = relations(
  menuCategories,
  ({ one, many }) => ({
    createdByProfile: one(profiles),
    menuItems: many(menuItems),
  }),
);

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuCategories),

  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
    relationName: "orderUser",
  }),

  rider: one(profiles, {
    fields: [orders.riderId],
    references: [profiles.id],
    relationName: "orderRider",
  }),

  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders),
  menuItem: one(menuItems),
}));
