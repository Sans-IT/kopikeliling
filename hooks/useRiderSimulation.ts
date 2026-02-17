import { supabase } from "@/lib/supabase";
import { Rider } from "@/lib/type";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export const useRiderSimulation = () => {
  const getRandomOffset = () => (Math.random() - 0.5) * 0.01;

  const [myLocation, setMyLocation] = useState({
    latitude: -6.2,
    longitude: 106.8166,
  });

  // Data Rider Lengkap (Metadata dijaga agar filter/detail tidak rusak)
  const initialRiders: Rider[] = [
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
      workEndTime: "23:59",
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
      workEndTime: "10:00",
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
      id: 114, // ID unik buat Kopler biar gak bentrok
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
  ];

  const [riders, setRiders] = useState<Rider[]>(initialRiders);
  const myLocationRef = useRef(myLocation);

  useEffect(() => {
    myLocationRef.current = myLocation;
  }, [myLocation]);

  useEffect(() => {
    // 1. Inisialisasi Data ke Supabase
    const syncToSupabase = async () => {
      const baseLat = myLocationRef.current.latitude || -6.2;
      const baseLng = myLocationRef.current.longitude || 106.8166;

      const updates = initialRiders.map((r) => ({
        id: r.id,
        name: r.name,
        latitude: baseLat + r.latOffset,
        longitude: baseLng + r.lngOffset,
        status: r.isOpen ? "OPEN" : "CLOSED",
      }));

      await supabase.from("riders").upsert(updates);
    };

    syncToSupabase();

    // 2. Simulasi Push: Update posisi ke DB setiap 5 detik
    const pushInterval = setInterval(async () => {
      const baseLat = myLocationRef.current.latitude || -6.2;
      const baseLng = myLocationRef.current.longitude || 106.8166;

      const updates = initialRiders.map((r) => ({
        id: r.id,
        // Simulasi gerak: Offset berubah dikit
        latitude: baseLat + r.latOffset + (Math.random() - 0.5) * 0.001,
        longitude: baseLng + r.lngOffset + (Math.random() - 0.5) * 0.001,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from("riders").upsert(updates);
    }, 5000);

    // 3. Subscription: Dengarkan perubahan Realtime
    const channel = supabase
      .channel("riders_realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "riders" },
        (payload) => {
          const newData = payload.new;
          const baseLat = myLocationRef.current.latitude || -6.2;
          const baseLng = myLocationRef.current.longitude || 106.8166;

          setRiders((prev) =>
            prev.map((r) =>
              r.id === newData.id
                ? {
                    ...r,
                    // Hitung balik ke offset supaya Marker tetap ditaruh dengan benar
                    latOffset: newData.latitude - baseLat,
                    lngOffset: newData.longitude - baseLng,
                  }
                : r,
            ),
          );
        },
      )
      .subscribe();

    // Browser/Native Location
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const location = await Location.getCurrentPositionAsync({});
        setMyLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (e) {
        console.log("Location error", e);
      }
    };
    getLocation();

    return () => {
      clearInterval(pushInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  return { riders, myLocation };
};
