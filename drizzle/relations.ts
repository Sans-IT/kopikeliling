import { relations } from "drizzle-orm/relations";
import { profiles, menuCategories, menuItems, orders, orderItems, ridersLocation } from "./schema";

export const menuCategoriesRelations = relations(menuCategories, ({one, many}) => ({
	profile: one(profiles, {
		fields: [menuCategories.createdBy],
		references: [profiles.id]
	}),
	menuItems: many(menuItems),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	menuCategories: many(menuCategories),
	orders_userId: many(orders, {
		relationName: "orders_userId_profiles_id"
	}),
	orders_riderId: many(orders, {
		relationName: "orders_riderId_profiles_id"
	}),
	ridersLocations: many(ridersLocation),
}));

export const menuItemsRelations = relations(menuItems, ({one, many}) => ({
	menuCategory: one(menuCategories, {
		fields: [menuItems.categoryId],
		references: [menuCategories.id]
	}),
	orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	profile_userId: one(profiles, {
		fields: [orders.userId],
		references: [profiles.id],
		relationName: "orders_userId_profiles_id"
	}),
	profile_riderId: one(profiles, {
		fields: [orders.riderId],
		references: [profiles.id],
		relationName: "orders_riderId_profiles_id"
	}),
	orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	menuItem: one(menuItems, {
		fields: [orderItems.menuItemId],
		references: [menuItems.id]
	}),
}));

export const ridersLocationRelations = relations(ridersLocation, ({one}) => ({
	profile: one(profiles, {
		fields: [ridersLocation.id],
		references: [profiles.id]
	}),
}));