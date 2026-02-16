import { useAppTheme } from "@/context/ThemeContext";
import { Rider } from "@/lib/type";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Divider, Searchbar } from "react-native-paper";

interface SearchBarPetaProps {
	riders: Rider[];
	onSelectRider: (rider: Rider) => void;
}

export default function SearchBarPeta({
	riders,
	onSelectRider,
}: SearchBarPetaProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const { theme } = useAppTheme();

	// --- LOGIC FILTER ---
	const availableRiders = riders.filter(
		(r) =>
			r.isOpen && // Hanya yang buka
			r.name.toLowerCase().includes(searchQuery.toLowerCase()), // Cocokkan nama
	);

	// Tampilkan list hanya jika user sedang mengetik
	const showList = searchQuery.length > 0;

	useFocusEffect(() => {
		return () => {
			// Fungsi ini akan jalan saat user meninggalkan layar peta
			setSearchQuery("");
		};
	});

	return (
		<View className="gap-3">
			<Searchbar
				placeholder="Cari Lokasi GoKopi..."
				onChangeText={setSearchQuery}
				value={searchQuery}
				style={{ height: 45, backgroundColor: theme.colors.surface }}
				inputStyle={{ fontSize: 14, alignSelf: "center", paddingVertical: 0 }}
			/>

			{showList && (
				<ListRiderAvailable
					filteredRiders={availableRiders}
					onPressItem={(rider) => {
						onSelectRider(rider);
						setSearchQuery(""); // Reset search setelah pilih
					}}
				/>
			)}
		</View>
	);
}

const ListRiderAvailable = ({
	filteredRiders,
	onPressItem,
}: {
	filteredRiders: Rider[];
	onPressItem: (r: Rider) => void;
}) => {
	const { theme, isDark } = useAppTheme();

	return (
		<View
			className="overflow-hidden shadow-lg rounded-b-xl"
			style={{
				backgroundColor: theme.colors.surface,
				elevation: 4,
				borderTopWidth: 0.5,
				borderTopColor: "#e0e0e0",
				maxHeight: 250, // <-- KUNCINYA DI SINI
			}}>
			<ScrollView bounces={false} showsVerticalScrollIndicator={false}>
				{filteredRiders.length > 0 ? (
					filteredRiders.map((item, index) => (
						<View key={item.id}>
							<TouchableOpacity
								onPress={() => onPressItem(item)}
								className="flex-row items-center p-4 active:bg-gray-100">
								<MaterialDesignIcons
									name="coffee"
									size={20}
									color={theme.colors.primary}
								/>
								<View className="ml-3">
									<Text
										className={`text-[14px] font-semibold ${isDark ? "text-white" : "text-black"} `}>
										{item.name}
									</Text>
									<Text
										className={`text-[11px] ${isDark ? "text-white" : "text-black"}`}>
										Tutup jam {item.workEndTime}
									</Text>
								</View>
							</TouchableOpacity>
							{index < filteredRiders.length - 1 && <Divider />}
						</View>
					))
				) : (
					<View className="p-5 items-center">
						<Text className="text-gray-400 text-[12px]">
							Tidak ada rider aktif ditemukan
						</Text>
					</View>
				)}
			</ScrollView>
		</View>
	);
};
