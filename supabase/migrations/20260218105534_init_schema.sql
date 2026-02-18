CREATE TYPE "public"."user_role" AS ENUM('GUEST', 'ADMIN', 'RIDER');
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"category" text NOT NULL,
	"image_url" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'GUEST' NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
CREATE TABLE "riders_location" (
	"id" uuid PRIMARY KEY NOT NULL,
	"latitude" numeric(10, 6) NOT NULL,
	"longitude" numeric(10, 6) NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
ALTER TABLE "riders_location" ADD CONSTRAINT "riders_location_id_profiles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
