import { pgTable, uuid, text, timestamp, foreignKey, integer, boolean, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const orderStatus = pgEnum("order_status", ['PENDING', 'ON_QUEUE', 'SUCCESS', 'CANCELLED'])
export const userRole = pgEnum("user_role", ['GUEST', 'ADMIN', 'RIDER'])


export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	role: userRole().default('GUEST').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const menuCategories = pgTable("menu_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [profiles.id],
			name: "menu_categories_created_by_profiles_id_fk"
		}).onDelete("set null"),
]);

export const menuItems = pgTable("menu_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price: integer().notNull(),
	categoryId: uuid("category_id"),
	imageUrl: text("image_url"),
	isAvailable: boolean("is_available").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [menuCategories.id],
			name: "menu_items_category_id_menu_categories_id_fk"
		}).onDelete("set null"),
]);

export const orders = pgTable("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	riderId: uuid("rider_id"),
	status: orderStatus().default('PENDING').notNull(),
	totalPrice: integer("total_price").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "orders_user_id_profiles_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.riderId],
			foreignColumns: [profiles.id],
			name: "orders_rider_id_profiles_id_fk"
		}).onDelete("set null"),
]);

export const orderItems = pgTable("order_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	menuItemId: uuid("menu_item_id").notNull(),
	quantity: integer().notNull(),
	priceAtOrder: integer("price_at_order").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_orders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.menuItemId],
			foreignColumns: [menuItems.id],
			name: "order_items_menu_item_id_menu_items_id_fk"
		}).onDelete("cascade"),
]);

export const ridersLocation = pgTable("riders_location", {
	id: uuid().primaryKey().notNull(),
	latitude: numeric({ precision: 10, scale:  6 }).notNull(),
	longitude: numeric({ precision: 10, scale:  6 }).notNull(),
	isOnline: boolean("is_online").default(false).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [profiles.id],
			name: "riders_location_id_profiles_id_fk"
		}).onDelete("cascade"),
]);
