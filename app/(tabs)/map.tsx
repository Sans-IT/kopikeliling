import RiderMarkers from "@/components/maps/RiderMarkers";
import SearchBarPeta from "@/components/maps/SearchBarPeta";
import { useRiderSimulation } from "@/hooks/useRiderSimulation";
import { Rider } from "@/lib/type";
import { getOSRMRoute } from "@/services/routeService";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { LatLng, MapType, Polyline } from "react-native-maps";
import { Button, Text, useTheme } from "react-native-paper";

export default function Map() {
	const { colors, dark } = useTheme();
	const mapRef = useRef<MapView>(null);
	const markerRefs = useRef<{ [key: number]: any }>({});
	const [mapType, setMapType] = useState<MapType>("standard");
	const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
	const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
	const { riders, myLocation } = useRiderSimulation();

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
	}, [myLocation.latitude]);

	useEffect(() => {
		if (!selectedRider) return;

		const currentRider = riders.find((r) => r.id === selectedRider.id);

		if (currentRider) {
			const updateRoute = async () => {
				const startPos = {
					latitude: myLocation.latitude + currentRider.latOffset,
					longitude: myLocation.longitude + currentRider.lngOffset,
				};

				const coords = await getOSRMRoute(startPos, myLocation);
				setRouteCoords(coords);
			};

			updateRoute();
		}
	}, [riders]);

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

	return (
		<View style={styles.container}>
			<MapView
				userInterfaceStyle={dark ? "dark" : "light"}
				tintColor={colors.primary}
				ref={mapRef}
				style={styles.map}
				mapType={mapType}
				showsUserLocation={true}
				mapPadding={{ top: 60, right: 0, left: 0, bottom: 0 }}>
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
						strokeColor={colors.primary}
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
						labelStyle={{ color: colors.onPrimary }}>
						Batalkan Rute
					</Button>
				)}
				<Button
					mode="contained"
					onPress={toggleMapType}
					style={{ backgroundColor: colors.primary }}
					labelStyle={{ color: colors.onPrimary }}>
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
