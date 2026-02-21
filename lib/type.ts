import { Database } from "./database.types";

export type UserRole = "GUEST" | "RIDER" | "ADMIN";

export interface CoffeeStock {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Rider {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  avatar?: string;
  isOpen: boolean;
  inventory: CoffeeStock[];
  workStartTime: string;
  workEndTime: string;
}

// Tipe Helper untuk Query Supabase (Biar gak pakai Any di Hook)
export type RiderQueryResult = Database["public"]["Tables"]["riders"]["Row"] & {
  profiles:
    | (Database["public"]["Tables"]["profiles"]["Row"] & {
        rider_inventory: (Database["public"]["Tables"]["rider_inventory"]["Row"] & {
          menu_items: Database["public"]["Tables"]["menu_items"]["Row"] | null;
        })[];
      })
    | null;
};
