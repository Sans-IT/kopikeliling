import { View, Text } from "react-native";
import React from "react";
import { useAppTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Orders() {
	const { theme } = useAppTheme();

	return (
		<View
			className="flex-1 p-5"
			style={{ backgroundColor: theme.colors.background }}>
			<Text>Orders</Text>
		</View>
	);
}
