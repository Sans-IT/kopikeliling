import { ThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

function AppContent() {
	const { theme, isDark } = useAppTheme();

	return (
		<PaperProvider theme={theme}>
			{/* StatusBar otomatis dynamic berdasarkan isDark */}
			<StatusBar style={isDark ? "light" : "dark"} />

			<Stack
				screenOptions={{
					headerShown: false,
					headerStyle: { backgroundColor: theme.colors.primary },
					headerTintColor: theme.colors.onPrimary,
				}}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="index" options={{ headerShown: true }} />
				<Stack.Screen
					name="rider/[id]"
					options={{
						headerShown: true,
						headerTitle: "Detail Rider",
					}}
				/>
			</Stack>
		</PaperProvider>
	);
}

export default function RootLayout() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}
