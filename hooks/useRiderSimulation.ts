import { supabase } from "@/lib/supabase";
import { Rider, RiderQueryResult } from "@/lib/type";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export const useRiderSimulation = () => {
  const { user, role } = useAuth();
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [riders, setRiders] = useState<Rider[]>([]);

  const myLocationRef = useRef(myLocation);
  const isFocused = useIsFocused();

  // Sinkronisasi Ref agar interval selalu dapat lokasi terbaru
  useEffect(() => {
    myLocationRef.current = myLocation;
  }, [myLocation]);

  // --- 1. Helper: Transformasi Data (Memoized) ---
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

  // --- 2. Fetch Semua Rider (Memoized) ---
  const fetchAllRiders = useCallback(async () => {
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
      .eq("profiles.role", "RIDER");

    if (error) {
      console.error("Error fetching all riders:", error);
      return;
    }

    const rawData = data as unknown as RiderQueryResult[];
    setRiders(rawData.map(transformRiderData));
  }, [transformRiderData]);

  // --- 3. Fetch Single Rider (Memoized) ---
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
        .single();

      if (error || !data) return;

      const transformed = transformRiderData(
        data as unknown as RiderQueryResult,
      );
      setRiders((prev) => [...prev.filter((r) => r.id !== id), transformed]);
    },
    [transformRiderData],
  );

  // --- 4. Realtime Listener ---
  useEffect(() => {
    if (!isFocused) return;

    fetchAllRiders();

    const channel = supabase
      .channel("rider_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "riders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            fetchSingleRider(payload.new.id);
          } else if (payload.eventType === "UPDATE") {
            setRiders((prev) =>
              prev.map((r) =>
                r.id === payload.new.id
                  ? {
                      ...r,
                      latitude: Number(payload.new.latitude),
                      longitude: Number(payload.new.longitude),
                      isOpen: payload.new.is_online,
                    }
                  : r,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setRiders((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isFocused, fetchAllRiders, fetchSingleRider]);

  // --- 5. Push Location Interval (Rider Only) ---
  useEffect(() => {
    if (!isFocused || role !== "RIDER" || !user) return;

    const pushInterval = setInterval(async () => {
      const currentLoc = myLocationRef.current;
      if (!currentLoc) return;

      const { error } = await supabase.from("riders").upsert([
        {
          id: user.id,
          latitude: currentLoc.latitude,
          longitude: currentLoc.longitude,
          is_online: true,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) console.error("Push Error:", error.message);
    }, 5000);

    return () => clearInterval(pushInterval);
  }, [role, user, isFocused]);

  return { riders, myLocation, setMyLocation };
};
