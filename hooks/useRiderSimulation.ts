import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Rider } from "@/lib/type";

export const useRiderSimulation = () => {
	const getRandomOffset = () => (Math.random() - 0.5) * 0.01;

	const [myLocation, setMyLocation] = useState({
		latitude: -6.2,
		longitude: 106.8166,
	});

	const [riders, setRiders] = useState<Rider[]>([
		{
			id: 1,
			name: "Agus",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			workStartTime: "08:00",
			workEndTime: "20:00",
			isOpen: false,
			inventory: [
				{ id: "c1", name: "Kopi Latte", qty: 12, price: 15000 },
				{ id: "c2", name: "Americano Ice", qty: 8, price: 12000 },
			],
		},
		{
			id: 2,
			name: "Budi",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			workStartTime: "09:00",
			isOpen: false,
			workEndTime: "21:00",
			inventory: [
				{ id: "c4", name: "Kopi Susu Gula Aren", qty: 20, price: 15000 },
			],
		},
		{
			id: 3,
			name: "Citra",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			isOpen: true,
			workStartTime: "17:00",
			workEndTime: "23:59", // Cocok untuk ngetes buka di malam hari
			inventory: [
				{ id: "c7", name: "Mocha Frappe", qty: 5, price: 25000 },
				{ id: "c8", name: "Cappuccino", qty: 10, price: 18000 },
			],
		},
		{
			id: 4,
			name: "Dedi",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			workStartTime: "05:00",
			isOpen: true,
			workEndTime: "10:00", // ini kemungkinan besar akan muncul "TUTUP" jika kamu buka siang/sore
			inventory: [{ id: "c5", name: "Espresso Single", qty: 15, price: 10000 }],
		},
		{
			id: 5,
			name: "Eka",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			workStartTime: "10:00",
			isOpen: true,
			workEndTime: "19:00",
			inventory: [
				{ id: "c6", name: "Cold Brew", qty: 4, price: 18000 },
				{ id: "c3", name: "Caramel Macchiato", qty: 6, price: 22000 },
			],
		},
		{
			id: 6,
			name: "Ekas",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			workStartTime: "10:00",
			isOpen: true,
			workEndTime: "19:00",
			inventory: [
				{ id: "c6", name: "Cold Brew", qty: 4, price: 18000 },
				{ id: "c3", name: "Caramel Macchiato", qty: 6, price: 22000 },
			],
		},
		{
			id: 7,
			name: "Ekad",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			workStartTime: "10:00",
			isOpen: true,
			workEndTime: "19:00",
			inventory: [
				{ id: "c6", name: "Cold Brew", qty: 4, price: 18000 },
				{ id: "c3", name: "Caramel Macchiato", qty: 6, price: 22000 },
			],
		},
		{
			id: 8,
			name: "Kopler",
			latOffset: getRandomOffset(),
			lngOffset: getRandomOffset(),
			workStartTime: "10:00",
			isOpen: true,
			workEndTime: "19:00",
			inventory: [
				{ id: "c6", name: "Cold Brew", qty: 4, price: 18000 },
				{ id: "c3", name: "Caramel Macchiato", qty: 6, price: 22000 },
			],
		},
	]);

	useEffect(() => {
		// Simulasi pergerakan rider
		const interval = setInterval(() => {
			setRiders((prev) =>
				prev.map((r: Rider) => ({
					...r,
					latOffset: r.latOffset + (Math.random() - 0.5) * 0.0005,
					lngOffset: r.lngOffset + (Math.random() - 0.5) * 0.0005,
				})),
			);
		}, 30000);

		// Ambil Lokasi User
		(async () => {
			let location = await Location.getCurrentPositionAsync({});
			setMyLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
		})();

		return () => clearInterval(interval);
	}, []);

	return { riders, myLocation };
};
