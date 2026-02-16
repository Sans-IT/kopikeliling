import { LatLng } from "react-native-maps";

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
