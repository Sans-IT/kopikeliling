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

  // 1. Fetch Riders & Their Locations (JOIN Profiles agar nama muncul)
  const fetchRiders = async () => {
    const { data, error } = await supabase
      .from("riders_location")
      .select(
        `
        latitude,
        longitude,
        is_online,
        profiles (
          id,
          full_name,
          role
        )
      `,
      )
      .eq("profiles.role", "RIDER"); // Hanya ambil yang rolenya RIDER

    if (error) {
      console.error("Error fetching riders:", error);
      return;
    }

    console.log("Raw Data from DB:", data);

    // Transform to Rider type
    const transformedRiders: Rider[] = (data || [])
      .filter((item: any) => item.profiles) // Pastikan data profile-nya ada
      .map((item: any) => {
        const rLat = parseFloat(item.latitude);
        const rLng = parseFloat(item.longitude);

        return {
          id: item.profiles.id,
          name: item.profiles.full_name || "Rider", // Ini yang bikin SEARCH ketemu
          latOffset: rLat - myLocationRef.current.latitude,
          lngOffset: rLng - myLocationRef.current.longitude,
          isOpen: item.is_online || false,
          workStartTime: "00:00",
          workEndTime: "23:59",
          inventory: [],
        };
      });

    console.log("Transformed Riders for UI:", transformedRiders);
    setRiders(transformedRiders);
  };

  // 2. Realtime Listener
  useEffect(() => {
    fetchRiders();

    const channel = supabase
      .channel("rider_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "riders_location" },
        () => {
          console.log("Realtime change detected, refetching...");
          fetchRiders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. If RIDER: Push location to Supabase
  useEffect(() => {
    if (role !== "RIDER" || !user) return;

    const pushInterval = setInterval(async () => {
      const { latitude, longitude } = myLocationRef.current;

      const { error } = await supabase.from("riders_location").upsert({
        id: user.id,
        latitude: latitude,
        longitude: longitude,
        is_online: true,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error pushing rider location:", error.message);
      }
    }, 10000);

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
