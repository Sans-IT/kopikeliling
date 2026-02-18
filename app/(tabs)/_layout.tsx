import { useAppTheme } from "@/context/ThemeContext";
import { CommonActions } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { BottomNavigation, Icon, IconButton } from "react-native-paper";

export default function TabLayout() {
	const { theme } = useAppTheme();
	return (
		<Tabs
			initialRouteName="beranda"
			screenOptions={{
				headerStyle: { backgroundColor: theme.colors.primary },
				headerTintColor: theme.colors.onPrimary,
				headerTitleStyle: { fontWeight: "bold" },
				headerRight: () => (
					<IconButton
						onPress={() => alert("Right button pressed!")}
						icon="bell"
						iconColor={theme.colors.onPrimary}
					/>
				),
			}}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<BottomNavigation.Bar
					navigationState={state}
					safeAreaInsets={insets}
					activeColor={theme.colors.primary}
					activeIndicatorStyle={{ backgroundColor: "transparent" }}
					style={{
						backgroundColor: theme.colors.surface,

						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: -3,
						},
						shadowOpacity: 0.3,
						shadowRadius: 4,
						elevation: 8,

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
			)}
		>
			<Tabs.Screen
				name="beranda"
				options={{
					title: "Beranda",
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Icon source="home" size={size} color={color} />
					),
				}}
			/>
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
				name="menu"
				options={{
					title: "Menu",
					tabBarIcon: ({ color, size }) => (
						<Icon source="file-document-multiple" size={size} color={color} />
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
