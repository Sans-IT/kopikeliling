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

// ---- 1. Enums ----
export const userRoleEnum = pgEnum("user_role", ["GUEST", "ADMIN", "RIDER"]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "ON_QUEUE",
  "SUCCESS",
  "CANCELLED",
]);

// ---- 2. Profiles (User Data) ----
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("GUEST").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---- 3. Riders (Data & Lokasi Rider) ----
export const riders = pgTable("riders", {
  id: uuid("id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  workStartTime: text("work_start_time").default("08:00").notNull(),
  workEndTime: text("work_end_time").default("22:00").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---- 4. Menu & Categories ----
export const menuCategories = pgTable("menu_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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

// ---- 5. Rider Inventory (CoffeeStock) ----
export const riderInventory = pgTable("rider_inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  riderId: uuid("rider_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  menuItemId: uuid("menu_item_id")
    .notNull()
    .references(() => menuItems.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---- 6. Orders ----
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id),
  riderId: uuid("rider_id").references(() => profiles.id),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  totalPrice: integer("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---- 7. RELATIONS (Sudah Diperbaiki) ----
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  riderData: one(riders), // Nama relasi lebih umum
  inventory: many(riderInventory),
  orders: many(orders),
}));

export const ridersRelations = relations(riders, ({ one }) => ({
  profile: one(profiles, {
    fields: [riders.id],
    references: [profiles.id],
  }),
}));

export const riderInventoryRelations = relations(riderInventory, ({ one }) => ({
  rider: one(profiles, {
    fields: [riderInventory.riderId],
    references: [profiles.id],
  }),
  item: one(menuItems, {
    fields: [riderInventory.menuItemId],
    references: [menuItems.id],
  }),
}));
