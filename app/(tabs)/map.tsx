import RiderMarkers from "@/components/maps/RiderMarkers";
import SearchBarPeta from "@/components/maps/SearchBarPeta";
import { useRiderSimulation } from "@/hooks/useRiderSimulation";
import { Rider } from "@/lib/type";
import { getOSRMRoute } from "@/services/routeService";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Linking, Platform, StyleSheet, View } from "react-native";
import MapView, { LatLng, MapType, Polyline, UrlTile } from "react-native-maps";
import { Button, Text, useTheme } from "react-native-paper";
import * as Location from "expo-location";
import { useAppTheme } from "@/context/ThemeContext";

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
			<View style={styles.overlayBottom}>
				{selectedRider && (
					<Button
						mode="contained"
						onPress={() => {
							setSelectedRider(null);
							setRouteCoords([]);
						}}
						style={{ backgroundColor: "#333", marginBottom: 10 }}
						labelStyle={{ color: theme.colors.onPrimary }}
					>
						Batalkan Rute
					</Button>
				)}
				<Button
					mode="contained"
					onPress={toggleMapType}
					style={{ backgroundColor: theme.colors.primary }}
					labelStyle={{ color: theme.colors.onPrimary }}
				>
					{mapType.toUpperCase()}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	map: { width: "100%", height: "100%" },
	overlayTop: { position: "absolute", top: 10, left: 10, right: 10 },
	overlayBottom: { position: "absolute", bottom: 10, right: 10 },
});

const CheckLocationPermission = () => {
	const { theme } = useAppTheme();

	return (
		<View
			style={[
				styles.container,
				{
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
					backgroundColor: theme.colors.background,
				},
			]}
		>
			<Text
				variant="headlineSmall"
				style={{ textAlign: "center", marginBottom: 10 }}
			>
				Akses Lokasi Ditolak
			</Text>
			<Text
				style={{
					textAlign: "center",
					marginBottom: 20,
					color: theme.colors.onSurfaceVariant,
				}}
			>
				Aplikasi membutuhkan izin lokasi untuk menampilkan peta dan mencari
				rider di sekitar Anda.
			</Text>
			<Button
				mode="contained"
				onPress={() => {
					Linking.openSettings();
				}}
			>
				Buka Pengaturan
			</Button>
		</View>
	);
};
