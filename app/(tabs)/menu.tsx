import React from "react";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { Card, Text, Surface, IconButton } from "react-native-paper";
import { useAppTheme } from "@/context/ThemeContext";

// Data Menu dengan Harga
const MENU_DATA = [
	{ title: "Burger Premium", desc: "Daging wagyu asli", price: 45000 },
	{ title: "Pizza Italian", desc: "Tipis dan renyah", price: 65000 },
	{ title: "Pasta Carbonara", desc: "Krim susu asli", price: 38000 },
	{ title: "Iced Caramel", desc: "Kopi arabika", price: 25000 },
	{ title: "Iced Caramel2", desc: "Kopi arabika", price: 25000 },
	{ title: "Iced Caramel3", desc: "Kopi arabika", price: 25000 },
	{ title: "Iced Caramel4", desc: "Kopi arabika", price: 25000 },
	{ title: "Iced Caramel5", desc: "Kopi arabika", price: 25000 },
];

export default function Menu() {
	const { theme } = useAppTheme();

	// Helper untuk format Rupiah
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(value);
	};

	const renderItem = ({ item }: { item: (typeof MENU_DATA)[number] }) => (
		<View className="flex-1 m-2">
			<Card
				mode="elevated"
				style={{ borderRadius: 16, overflow: "hidden", elevation: 4 }}>
				{/* Header Gambar dengan Background halus */}
				<View
					className="items-center justify-center p-4"
					style={{ backgroundColor: theme.colors.surfaceVariant }}>
					<Image
						source={require("@/assets/images/logo.png")}
						style={{ width: 80, height: 80 }}
						resizeMode="contain"
					/>
				</View>

				<Card.Content className="p-3">
					<Text variant="titleMedium" numberOfLines={1} className="font-bold">
						{item.title}
					</Text>
					<Text
						variant="bodySmall"
						numberOfLines={1}
						style={{ color: theme.colors.outline }}>
						{item.desc}
					</Text>

					{/* Bagian Harga & Action */}
					<View className="flex-row justify-between items-center mt-3">
						<Text
							variant="titleSmall"
							style={{ color: theme.colors.primary, fontWeight: "700" }}>
							{formatCurrency(item.price)}
						</Text>
					</View>
				</Card.Content>
			</Card>
		</View>
	);

	return (
		<View
			className="flex-1"
			style={{ backgroundColor: theme.colors.background }}>
			<FlatList
				data={MENU_DATA}
				renderItem={renderItem}
				keyExtractor={(item) => item.title}
				numColumns={2}
				contentContainerStyle={{ padding: 12 }}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
