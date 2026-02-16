import { useAppTheme } from "@/context/ThemeContext";
import { CommonActions } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { BottomNavigation, Icon, useTheme } from "react-native-paper";

export default function TabLayout() {
	const { theme } = useAppTheme();
	return (
		<Tabs
			screenOptions={{
				headerStyle: { backgroundColor: theme.colors.primary },
				headerTintColor: theme.colors.onPrimary,
				headerTitleStyle: { fontWeight: "bold" },
			}}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<BottomNavigation.Bar
					navigationState={state}
					safeAreaInsets={insets}
					// 1. Warna Ikon & Teks saat aktif (Merah GoKopi)
					activeColor={theme.colors.primary}
					// 2. Warna "Kapsul" di belakang ikon (opsional)
					// Jika ingin kapsulnya merah transparan: theme.colors.primary + '20'
					// Jika ingin kapsulnya tidak ada, bisa set ke 'transparent'
					activeIndicatorStyle={{ backgroundColor: "transparent" }}
					style={{
						// Menggunakan theme.colors.surface agar Light = Putih, Dark = Dark Gray bawaan Paper
						backgroundColor: theme.colors.surface,

						// Shadow tetap ada di atas
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: -3,
						},
						shadowOpacity: 0.3, // Lebih tegas dikit pas dark mode
						shadowRadius: 4,
						elevation: 8, // Untuk Android

						// Garis tipis di atas biar makin rapi (opsional)
						borderTopWidth: 0.5,
						borderTopColor: theme.colors.outlineVariant,
					}}
					shifting={false}
					compact={true}
					onTabPress={({ route }) => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						});

						const isFocused = state.routes[state.index].key === route.key;

						if (!isFocused && !event.defaultPrevented) {
							navigation.dispatch({
								...CommonActions.navigate(route.name, route.params),
								target: state.key,
							});
						}
					}}
					renderIcon={({ route, focused, color }) => {
						const { options } = descriptors[route.key];
						if (options.tabBarIcon) {
							// 'color' di sini akan otomatis mengikuti activeColor atau inactiveColor
							return options.tabBarIcon({ focused, color, size: 24 });
						}
						return null;
					}}
					getLabelText={({ route }) => {
						const { options } = descriptors[route.key];
						const label =
							options.tabBarLabel !== undefined
								? options.tabBarLabel
								: options.title !== undefined
									? options.title
									: route.name;

						return typeof label === "string" ? label : route.name;
					}}
				/>
			)}>
			<Tabs.Screen
				name="map"
				options={{
					title: "Peta",
					tabBarIcon: ({ color, size }) => (
						<Icon source="map-marker-radius" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="orders"
				options={{
					title: "Pesanan",
					tabBarIcon: ({ color, size }) => (
						<Icon source="coffee" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profil",
					tabBarIcon: ({ color, size }) => (
						<Icon source="account" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
