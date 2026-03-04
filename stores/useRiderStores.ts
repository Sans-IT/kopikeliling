import { create } from "zustand";
import { Rider } from "@/lib/type";

interface RiderState {
	riders: Rider[];
	selectedRider: Rider | null;

	setRiders: (riders: Rider[]) => void;
	setSelectedRider: (rider: Rider | null) => void;
	clearRiders: () => void;
}

export const useRiderStore = create<RiderState>((set) => ({
	riders: [],
	selectedRider: null,

	setRiders: (riders: Rider[]) => set({ riders }),
	setSelectedRider: (rider: Rider | null) => set({ selectedRider: rider }),
	clearRiders: () => set({ riders: [] }),
}));
