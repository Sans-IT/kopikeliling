import { ButtonMapUI } from "@/components/maps/ButtonMapUI";
import { CheckLocationPermission } from "@/components/maps/LocationPermission";
import RiderMarkers from "@/components/maps/RiderMarkers";
import SearchBarPeta from "@/components/maps/SearchBarPeta";
import { useAppTheme } from "@/context/ThemeContext";
import { useRiderSimulation } from "@/hooks/useRiderSimulation";
import { Rider } from "@/lib/type";
import { getOSRMRoute } from "@/services/routeService";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import MapView, { LatLng, MapType, Polyline } from "react-native-maps";
import { Text } from "react-native-paper";

export default function Map() {
  const { theme, isDark } = useAppTheme();
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<{ [key: string]: any }>({});
  const hasInitialZoom = useRef(false);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );
  const { riders, myLocation, setMyLocation } = useRiderSimulation(); // <- Hook database state
  const currentRiderData = riders.find((r) => r.id === selectedRider?.id);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const routeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animasi gps ke User lokasi saat ini
  useEffect(() => {
    if (mapRef.current && myLocation && !hasInitialZoom.current) {
      mapRef.current.animateToRegion({
        ...myLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      hasInitialZoom.current = true;
    }
  }, [myLocation]);

  // 1. Ambil lokasi user saat pertama kali (GPS HP)
  useEffect(() => {
    let isMounted = true;

    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationPermission(false);
          return;
        }

        setLocationPermission(true);

        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation, // ✅ hemat baterai
            distanceInterval: 3, // ✅ hanya update jika bergerak >5 meter
            timeInterval: 5000, // ✅ lebih smooth
          },
          (location) => {
            if (!isMounted) return;

            setMyLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          },
        );
      } catch (e) {
        console.error("Location watcher error:", e);
      }
    };

    startWatching();

    return () => {
      isMounted = false;
      subscriptionRef.current?.remove();
    };
  }, []);

  // 2. Efek Realtime Route: Update garis saat Rider bergerak
  useEffect(() => {
    if (!selectedRider || !currentRiderData || !myLocation) return;

    // ✅ debounce supaya tidak spam OSRM
    if (routeTimeoutRef.current) {
      clearTimeout(routeTimeoutRef.current);
    }

    routeTimeoutRef.current = setTimeout(async () => {
      const riderPos = {
        latitude: currentRiderData.latitude,
        longitude: currentRiderData.longitude,
      };

      const coords = await getOSRMRoute(riderPos, myLocation);
      if (coords && coords.length > 0) {
        setRouteCoords(coords);
      }
    }, 800); // debounce 800ms

    return () => {
      if (routeTimeoutRef.current) {
        clearTimeout(routeTimeoutRef.current);
      }
    };
  }, [currentRiderData, myLocation, selectedRider]);

  const handleRiderPress = async (rider: Rider) => {
    if (!myLocation) return setLocationPermission(false);
    setSelectedRider(rider);

    // Langsung pakai koordinat dari objek rider
    const riderPos = {
      latitude: rider.latitude,
      longitude: rider.longitude,
    };

    const coords = await getOSRMRoute(riderPos, myLocation);
    setRouteCoords(coords);

    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 150, right: 100, bottom: 150, left: 100 },
      animated: true,
    });
  };

  if (Platform.OS === "web")
    return (
      <View style={styles.container}>
        <Text>Web tidak didukung</Text>
      </View>
    );
  if (locationPermission === false) return <CheckLocationPermission />;

  return (
    <View style={styles.container}>
      <MapView
        userInterfaceStyle={isDark ? "dark" : "light"}
        tintColor={theme.colors.primary}
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        showsUserLocation={true}
        mapPadding={{ top: 50, right: 0, left: 0, bottom: 0 }}
      >
        <RiderMarkers
          riders={riders}
          onRiderPress={handleRiderPress}
          markerRefs={markerRefs}
        />

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={theme.colors.primary}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      <View style={styles.overlayTop}>
        <SearchBarPeta
          riders={riders}
          onSelectRider={(rider) => {
            handleRiderPress(rider);
            markerRefs.current[rider.id]?.showCallout();
          }}
        />
      </View>

      <ButtonMapUI
        mapType={mapType}
        setMapType={setMapType}
        selectedRider={selectedRider}
        setSelectedRider={setSelectedRider}
        setRouteCoords={setRouteCoords}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  overlayTop: { position: "absolute", top: 10, left: 10, right: 10 },
  overlayBottom: { position: "absolute", bottom: 10, right: 10 },
});
