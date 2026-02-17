export type UserRole = "USER" | "RIDER" | "ADMIN";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  // Data khusus Rider
  is_online: boolean;
  last_latitude?: number;
  last_longitude?: number;
  last_updated?: string;
}

// Type untuk data Rider hasil simulasi
export interface Rider {
  id: number;
  name: string;
  latOffset: number;
  lngOffset: number;
}

export interface CoffeeStock {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Rider {
  id: number;
  name: string;
  latOffset: number;
  lngOffset: number;
  avatar?: string;
  inventory?: CoffeeStock[];
  isOpen: boolean; // Tambahkan ini sebagai saklar u
  workStartTime: string; // Contoh: "08:00"
  workEndTime: string; // Contoh: "20:00"
}
