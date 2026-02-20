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
  const markerRefs = useRef<{ [key: number]: any }>({});
  const [mapType, setMapType] = useState<MapType>("standard");
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const {
    riders,
    myLocation,
    setLocationPermission,
    setMyLocation,
    locationPermission,
  } = useRiderSimulation();
  const currentRiderData = riders.find((r) => r.id === selectedRider?.id);

  // Akses ijin untuk google maps api
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationPermission(false);
          return;
        }

        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setMyLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (e) {
        setLocationPermission(false);
        Alert.alert("Location error", "Tidak dapat mengakses lokasi");
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (mapRef.current && myLocation) {
      mapRef.current.animateToRegion(
        {
          ...myLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    }
  }, [myLocation]);

  useEffect(() => {
    if (!selectedRider || !currentRiderData || !myLocation) return;

    const updateRoute = async () => {
      const startPos = {
        latitude: myLocation.latitude + currentRiderData.latOffset,
        longitude: myLocation.longitude + currentRiderData.lngOffset,
      };

      const coords = await getOSRMRoute(startPos, myLocation);
      if (coords && coords.length > 0) {
        setRouteCoords(coords);
      }
    };

    updateRoute();
  }, [
    currentRiderData?.latOffset,
    currentRiderData?.lngOffset,
    myLocation?.latitude,
    myLocation?.longitude,
    selectedRider?.id,
  ]);

  const handleRiderPress = async (rider: Rider) => {
    setSelectedRider(rider);

    const startPos = {
      latitude: myLocation.latitude + rider.latOffset,
      longitude: myLocation.longitude + rider.lngOffset,
    };

    const coords = await getOSRMRoute(startPos, myLocation);
    setRouteCoords(coords);

    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 150, right: 100, bottom: 150, left: 100 },
      animated: true,
    });
  };

  const toggleMapType = () => {
    setMapType((prev) =>
      prev === "standard"
        ? "satellite"
        : prev === "satellite"
          ? "terrain"
          : "standard",
    );
  };

  if (Platform.OS === "web")
    return (
      <View style={styles.container}>
        <Text>Web tidak didukung</Text>
      </View>
    );

  // Jika ijin lokasi ditolak
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
        {/* Render Rider Markers dengan callback onPress */}
        <RiderMarkers
          riders={riders}
          myLocation={myLocation}
          onRiderPress={handleRiderPress}
          markerRefs={markerRefs}
        />

        {/* GAMBAR RUTE ASLI (HASIL OSRM) */}
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

      {/* Overlay Searchbar */}
      <View style={styles.overlayTop}>
        <SearchBarPeta
          riders={riders}
          onSelectRider={(rider) => {
            handleRiderPress(rider);

            markerRefs.current[rider.id]?.showCallout();
          }}
        />
      </View>

      {/* Kontrol UI */}
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
