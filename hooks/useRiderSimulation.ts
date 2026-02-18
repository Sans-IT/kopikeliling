import { supabase } from "@/lib/supabase";
import { Rider } from "@/lib/type";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";

export const useRiderSimulation = () => {
	const { user, role } = useAuth();
	const [myLocation, setMyLocation] = useState({
		latitude: -7.2575,
		longitude: 112.7521,
	});
	const [riders, setRiders] = useState<Rider[]>([]);
	const [locationPermission, setLocationPermission] = useState<boolean | null>(
		null,
	);
	const myLocationRef = useRef(myLocation);

	useEffect(() => {
		myLocationRef.current = myLocation;
	}, [myLocation]);

	// 1. Fetch Riders & Their Locations
	const fetchRiders = async () => {
		const { data, error } = await supabase
			.from("profiles")
			.select(
				`
				id,
				full_name,
				role,
				riders_location (
					latitude,
					longitude,
					is_online
				)
			`,
			)
			.eq("role", "RIDER");

		if (error) {
			console.error("Error fetching riders:", error);
			return;
		}

		// Transform to Rider type
		const transformedRiders: Rider[] = data.map((r: any) => ({
			id: r.id,
			name: r.full_name || "Rider",
			// We use latOffset/lngOffset for the component compatibility,
			// but we calculate them based on actual lat/lng
			latOffset: r.riders_location?.latitude
				? r.riders_location.latitude - myLocationRef.current.latitude
				: 0,
			lngOffset: r.riders_location?.longitude
				? r.riders_location.longitude - myLocationRef.current.longitude
				: 0,
			isOpen: r.riders_location?.is_online || false,
			workStartTime: "00:00",
			workEndTime: "23:59",
			inventory: [], // Inventory could be another table later
		}));

		setRiders(transformedRiders);
	};

	useEffect(() => {
		fetchRiders();

		// 2. Realtime Listener for Location Updates
		const channel = supabase
			.channel("rider_updates")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "riders_location" },
				() => {
					fetchRiders(); // Re-fetch on any change for simplicity or optimize with payload
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	// 3. If RIDER: Push location to Supabase periodically
	useEffect(() => {
		if (role !== "RIDER" || !user) return;

		const pushInterval = setInterval(async () => {
			const { latitude, longitude } = myLocationRef.current;
			await supabase.from("riders_location").upsert({
				id: user.id,
				latitude,
				longitude,
				is_online: true,
				updated_at: new Date().toISOString(),
			});
		}, 10000); // Pulse every 10 seconds

		return () => clearInterval(pushInterval);
	}, [role, user]);

	return {
		riders,
		myLocation,
		setMyLocation,
		setLocationPermission,
		locationPermission,
	};
};
