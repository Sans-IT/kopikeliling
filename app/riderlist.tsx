import { useAppTheme } from "@/context/ThemeContext";
import { Rider } from "@/lib/type";
import React from "react";
import { FlatList, View } from "react-native";
import {
	Avatar,
	Card,
	Text,
	TouchableRipple,
	ActivityIndicator,
} from "react-native-paper";
import { useRiderSimulation } from "@/hooks/useRiderSimulation"; // Import hook kamu
import { useRouter } from "expo-router";

export default function RiderListScreen() {
	const { theme } = useAppTheme();
	const router = useRouter();

	// Ambil data langsung dari simulation hook
	const { riders, loadingData } = useRiderSimulation();

	const renderItem = (item: Rider) => (
		<TouchableRipple
			onPress={() => router.push(`/rider/${item.id}`)}
			rippleColor="rgba(0, 0, 0, .1)"
			className="mb-1">
			<Card
				className="mx-4 mt-3 rounded-2xl shadow-sm overflow-hidden border border-gray-100"
				style={{ backgroundColor: theme.colors.surface }}>
				<View className="flex-row items-center p-4">
					{/* Avatar & Status Indicator */}
					<View className="relative">
						<Avatar.Text
							size={48}
							label={item.name.substring(0, 2).toUpperCase()}
							className="bg-indigo-600"
							labelStyle={{ fontWeight: "bold" }}
						/>
						{/* Dot Status: Hijau jika isOpen (online) */}
						<View
							className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
								item.isOpen ? "bg-green-500" : "bg-gray-400"
							}`}
						/>
					</View>

					{/* Info Rider */}
					<View className="flex-1 ml-4">
						<Text
							className="text-lg font-bold text-gray-800"
							style={{ color: theme.colors.onSurface }}>
							{item.name}
						</Text>
						<View className="flex-row items-center mt-0.5">
							<Text className="text-xs text-gray-500 uppercase tracking-wider">
								ID: {item.id.substring(0, 8)}...
							</Text>
							<View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
							<Text
								className={`text-xs font-medium ${item.isOpen ? "text-green-600" : "text-gray-400"}`}>
								{item.isOpen ? "Online" : "Offline"}
							</Text>
						</View>
					</View>

					{/* Icon/Arrow indicating clickability */}
					<Avatar.Icon
						size={30}
						icon="chevron-right"
						style={{ backgroundColor: "transparent" }}
						color={theme.colors.outline}
					/>
				</View>
			</Card>
		</TouchableRipple>
	);

	return (
		<View
			className="flex-1"
			style={{ backgroundColor: theme.colors.background }}>
			{loadingData && riders.length === 0 ? (
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator
						animating={true}
						color={theme.colors.primary}
						size="large"
					/>
					<Text className="mt-4 text-gray-500">
						Menghubungkan ke satelit...
					</Text>
				</View>
			) : (
				<FlatList
					data={riders}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => renderItem(item)}
					contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
					ListEmptyComponent={
						<View className="items-center mt-20 px-10">
							<Avatar.Icon
								size={80}
								icon="bike-fast"
								style={{ backgroundColor: "#f0f0f0" }}
								color="#ccc"
							/>
							<Text className="text-gray-400 italic mt-4 text-center">
								Tidak ada rider online saat ini.
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
}
