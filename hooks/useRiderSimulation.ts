import { supabase } from "@/lib/supabase";
import { Rider, RiderQueryResult } from "@/lib/type";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";

export const useRiderSimulation = () => {
	const { user, role } = useAuth();
	const [loadingData, setLoadingData] = useState(false);
	const [myLocation, setMyLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [riders, setRiders] = useState<Rider[]>([]);

	const isFocused = useIsFocused();

	// ✅ refs untuk optimasi push
	const lastPushTimeRef = useRef(0);
	const lastSentLocationRef = useRef<{
		latitude: number;
		longitude: number;
	} | null>(null);

	// ================================
	// 🔧 CONFIG PRODUCTION
	// ================================
	const MOVE_THRESHOLD = 0.00002; // ≈ 2 meter
	const MOVING_INTERVAL = 3000; // 3 detik
	const IDLE_INTERVAL = 12000; // 12 detik

	// ================================
	// 🔧 HELPERS
	// ================================

	const getDistanceDelta = (
		oldPos: { latitude: number; longitude: number } | null,
		newPos: { latitude: number; longitude: number },
	) => {
		if (!oldPos) return Infinity;

		return Math.max(
			Math.abs(oldPos.latitude - newPos.latitude),
			Math.abs(oldPos.longitude - newPos.longitude),
		);
	};

	const hasMovedSignificantly = (
		oldPos: { latitude: number; longitude: number } | null,
		newPos: { latitude: number; longitude: number },
	): boolean => {
		return getDistanceDelta(oldPos, newPos) > MOVE_THRESHOLD;
	};

	// ================================
	// 🔧 TRANSFORM
	// ================================
	const transformRiderData = useCallback(
		(item: RiderQueryResult): Rider => ({
			id: item.profiles?.id || item.id,
			name: item.profiles?.full_name || "Driver",
			avatar: item.profiles?.avatar_url || undefined,
			latitude: Number(item.latitude),
			longitude: Number(item.longitude),
			isOpen: item.is_online ?? false,
			workStartTime: item.work_start_time || "08:00",
			workEndTime: item.work_end_time || "22:00",
			inventory: (item.profiles?.rider_inventory || []).map((inv) => ({
				id: inv.menu_items?.id || inv.id,
				name: inv.menu_items?.name || "Produk",
				qty: inv.quantity,
				price: inv.menu_items?.price || 0,
			})),
		}),
		[],
	);

	// ================================
	// 🔧 FETCH ALL
	// ================================
	const fetchAllRiders = useCallback(async () => {
		setLoadingData(true);
		try {
			const { data, error } = await supabase
				.from("riders")
				.select(
					`
          id, latitude, longitude, is_online, work_start_time, work_end_time,
          profiles ( 
            id, full_name, role, avatar_url,
            rider_inventory ( 
              id, quantity, 
              menu_items ( id, name, price ) 
            )
          )
        `,
				)
				.not("profiles", "is", null)
				.eq("is_online", true)
				.eq("profiles.role", "RIDER");

			if (error) {
				console.error("Error fetching riders:", error);
				return;
			}

			const rawData = data as unknown as RiderQueryResult[];
			setRiders(rawData.map(transformRiderData));
		} catch (err) {
			console.error("Fetch Riders Exception:", err);
		} finally {
			setLoadingData(false);
		}
	}, [transformRiderData]);

	// ================================
	// 🔧 FETCH SINGLE
	// ================================
	const fetchSingleRider = useCallback(
		async (id: string) => {
			const { data, error } = await supabase
				.from("riders")
				.select(
					`
          id, latitude, longitude, is_online, work_start_time, work_end_time,
          profiles ( 
            id, full_name, role, avatar_url,
            rider_inventory ( 
              id, quantity, 
              menu_items ( id, name, price ) 
            )
          )
        `,
				)
				.eq("id", id)
				.eq("is_online", true)
				.single();

			if (error || !data) return;

			const transformed = transformRiderData(
				data as unknown as RiderQueryResult,
			);

			setRiders((prev) => [
				...prev.filter((r) => r.id !== transformed.id),
				transformed,
			]);
		},
		[transformRiderData],
	);

	// ================================
	// 🔴 REALTIME LISTENER
	// ================================
	useEffect(() => {
		if (!isFocused) return;

		fetchAllRiders();

		const channel = supabase
			.channel("rider_updates")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "riders" },
				(payload) => {
					const newData = payload.new as any;
					const oldData = payload.old as any;

					if (payload.eventType === "INSERT") {
						if (newData.is_online) fetchSingleRider(newData.id);
					} else if (payload.eventType === "UPDATE") {
						const targetId = newData.id;

						if (targetId === user?.id && role === "RIDER") return;

						if (newData.is_online === false) {
							setRiders((prev) => prev.filter((r) => r.id !== targetId));
							return;
						}

						setRiders((prev) => {
							const existing = prev.find((r) => r.id === targetId);
							if (!existing) {
								fetchSingleRider(targetId);
								return prev;
							}

							const newCoords = {
								latitude: Number(newData.latitude),
								longitude: Number(newData.longitude),
							};

							if (
								hasMovedSignificantly(
									{
										latitude: existing.latitude,
										longitude: existing.longitude,
									},
									newCoords,
								)
							) {
								return prev.map((r) =>
									r.id === targetId ? { ...r, ...newCoords } : r,
								);
							}

							return prev;
						});
					} else if (payload.eventType === "DELETE") {
						setRiders((prev) => prev.filter((r) => r.id !== oldData.id));
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [isFocused, fetchAllRiders, fetchSingleRider, user?.id, role]);

	// ================================
	// 🚀 SMART PUSH (ANTI SPAM)
	// ================================
	useEffect(() => {
		if (!isFocused || role !== "RIDER" || !user || !myLocation) return;

		const now = Date.now();
		const delta = getDistanceDelta(lastSentLocationRef.current, myLocation);

		const isMoving = delta > MOVE_THRESHOLD;
		const requiredInterval = isMoving ? MOVING_INTERVAL : IDLE_INTERVAL;

		if (now - lastPushTimeRef.current < requiredInterval) return;

		lastPushTimeRef.current = now;
		lastSentLocationRef.current = myLocation;

		// ✅ update local rider dulu (biar marker responsif)
		setRiders((prev) => {
			const existing = prev.find((r) => r.id === user.id);

			if (!existing) {
				return [
					...prev,
					{
						id: user.id,
						name: "Saya",
						avatar: undefined,
						latitude: myLocation.latitude,
						longitude: myLocation.longitude,
						isOpen: true,
						workStartTime: "08:00",
						workEndTime: "22:00",
						inventory: [],
					},
				];
			}

			return prev.map((r) =>
				r.id === user.id
					? {
							...r,
							latitude: myLocation.latitude,
							longitude: myLocation.longitude,
						}
					: r,
			);
		});

		// ✅ push ke Supabase
		const pushToSupabase = async () => {
			try {
				await supabase.from("riders").upsert([
					{
						id: user.id,
						latitude: myLocation.latitude,
						longitude: myLocation.longitude,
						is_online: true,
						updated_at: new Date().toISOString(),
					},
				]);
			} catch (err) {
				console.error("🔴 Push Exception:", err);
			}
		};

		pushToSupabase();
	}, [myLocation, isFocused, role, user?.id]);

	return { riders, myLocation, setMyLocation, loadingData };
};
