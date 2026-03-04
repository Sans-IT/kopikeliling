import { useAppTheme } from "@/context/ThemeContext";
import { Rider } from "@/lib/type";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { MapType } from "react-native-maps"; // Import tipe MapType
import { Button } from "react-native-paper";
import { useRiderStore } from "@/stores/useRiderStores";
interface ButtonMapUIProps {
	mapType: MapType;
	setMapType: React.Dispatch<React.SetStateAction<MapType>>;
	selectedRider: any; // Sesuaikan dengan tipe Rider kamu
	setSelectedRider: (rider: Rider | null) => void;
	setRouteCoords: (coords: any[]) => void;
	riders: Rider[];
}

export const ButtonMapUI = ({
	mapType,
	setMapType,
	selectedRider,
	setSelectedRider,
	setRouteCoords,
	riders,
}: ButtonMapUIProps) => {
	const { theme } = useAppTheme();
	const router = useRouter();
	const setRiders = useRiderStore((s) => s.setRiders);

	const toggleMapType = () => {
		setMapType((prev: MapType) => {
			if (prev === "standard") return "satellite";
			if (prev === "satellite") return "terrain";
			return "standard";
		});
	};

	return (
		<View style={styles.overlayBottom} className="gap-2">
			{selectedRider && (
				<Button
					mode="contained"
					onPress={() => {
						setSelectedRider(null);
						setRouteCoords([]);
					}}
					// Pakai warna error atau abu-abu gelap agar kontras dengan tombol utama
					style={{ backgroundColor: theme.colors.primary }}
					labelStyle={{ color: "white" }}>
					Batalkan Rute
				</Button>
			)}

			<Button
				mode="contained"
				onPress={toggleMapType}
				icon="map-outline"
				style={{ backgroundColor: theme.colors.primary }}
				labelStyle={{ color: theme.colors.onPrimary }}>
				{/* Mengubah tampilan teks agar lebih user-friendly */}
				{mapType === "standard"
					? "Peta"
					: mapType === "satellite"
						? "Satelit"
						: "Relief"}
			</Button>
			<Button
				mode="contained"
				icon="account-group"
				style={{ backgroundColor: theme.colors.primary }}
				labelStyle={{ color: theme.colors.onPrimary }}
				onPress={() => {
					setRiders(riders); // ✅ simpan ke global store
					router.push("/riderlist"); // ✅ tanpa params
				}}>
				Info Rider
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	overlayBottom: {
		position: "absolute",
		bottom: 10, // Kasih jarak sedikit lebih tinggi dari pojok
		right: 10,
	},
});
