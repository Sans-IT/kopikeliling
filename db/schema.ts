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

// Define User Roles Enum
export const userRoleEnum = pgEnum("user_role", ["GUEST", "ADMIN", "RIDER"]);

// Profiles Table (Links to Supabase Auth)
export const profiles = pgTable("profiles", {
	id: uuid("id").primaryKey().notNull(), // This will match auth.users id
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	role: userRoleEnum("role").default("GUEST").notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Rider Locations Table (Realtime Updates)
export const ridersLocation = pgTable("riders_location", {
	id: uuid("id")
		.primaryKey()
		.references(() => profiles.id, { onDelete: "cascade" }),
	latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
	longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
	isOnline: boolean("is_online").default(false).notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu Items Table
export const menuItems = pgTable("menu_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	price: integer("price").notNull(),
	category: text("category").notNull(), // e.g., 'Coffee', 'Tea', 'Snack'
	imageUrl: text("image_url"),
	isAvailable: boolean("is_available").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});
