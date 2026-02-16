import { useRouter } from "expo-router";
import { View } from "react-native";
import {
	Avatar,
	Button,
	List,
	Switch,
	Text,
	useTheme,
} from "react-native-paper";
import { useAppTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
	const { isDark, toggleTheme, theme } = useAppTheme();
	const { colors } = useTheme();
	const router = useRouter();

	return (
		<SafeAreaView
			className="flex-1 px-5"
			style={{ backgroundColor: theme.colors.background }}>
			<View className="items-center mb-6">
				<Avatar.Text size={80} label="GK" className="bg-primary" />
				<Text variant="headlineMedium" className="mt-4 font-bold">
					User GoKopi
				</Text>
			</View>

			<List.Section>
				<List.Subheader>Settings</List.Subheader>
				<List.Item
					title="Dark Mode"
					left={() => (
						<List.Icon icon={isDark ? "weather-night" : "weather-sunny"} />
					)}
					right={() => (
						<Switch
							value={isDark}
							onValueChange={toggleTheme}
							color={theme.colors.primary}
						/>
					)}
				/>
			</List.Section>

			<Button
				onPress={() => router.push("/")}
				mode="contained"
				labelStyle={{ color: colors.onPrimary }}>
				Logout
			</Button>
		</SafeAreaView>
	);
}
