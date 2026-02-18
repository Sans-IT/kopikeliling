import { ThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import "../global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";

function AppContent() {
	const { theme, isDark } = useAppTheme();
	const queryClient = new QueryClient();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PaperProvider theme={theme}>
				<StatusBar style={isDark ? "light" : "dark"} />

				<QueryClientProvider client={queryClient}>
					<Stack
						screenOptions={{
							headerShown: false,
							headerStyle: { backgroundColor: theme.colors.primary },
							headerTintColor: theme.colors.onPrimary,
						}}
					>
						<Stack.Screen name="index" />
						<Stack.Screen
							name="notification"
							options={{
								title: "Notifikasi",
								headerShown: true,
							}}
						/>
						<Stack.Screen name="(tabs)" />
						<Stack.Screen
							name="rider/[id]"
							options={{
								headerShown: true,
								headerTitle: "Detail Rider",
							}}
						/>
					</Stack>
				</QueryClientProvider>
			</PaperProvider>
		</GestureHandlerRootView>
	);
}

export default function RootLayout() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}
