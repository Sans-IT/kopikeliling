import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
	Avatar,
	Button,
	Divider,
	List,
	Text,
	useTheme,
} from "react-native-paper";
import { useAppTheme } from "../../context/ThemeContext";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
	const { isDark, toggleTheme, theme } = useAppTheme();
	const { colors } = useTheme();
	const router = useRouter();
	const { session } = useAuth();

	const logOut = async () => {
		const { error } = await supabase.auth.signOut();
	};

	const ACCOUNT_SETTINGS = [
		{
			id: "darkmode",
			title: "Dark Mode",
			icon: isDark ? "weather-night" : "weather-sunny",
			route: null,
			isDarkModeToggle: true, // Flag khusus untuk trigger fungsi toggle
		},
		{
			id: "notif",
			title: "Notifikasi",
			icon: "bell-outline",
			route: "/notifikasi",
		},
		{
			id: "akun",
			title: "Detail Akun",
			icon: "account-circle-outline",
			route: "/profile/edit",
		},
	];

	// Kelompok 2: Dukungan & Informasi
	const SUPPORT_INFO = [
		{
			id: "rating",
			title: "Beri Rating",
			icon: "star-outline",
			route: "/rating",
		},
		{
			id: "contact",
			title: "Hubungi Kami",
			icon: "whatsapp",
			route: "/contact",
		},
		{
			id: "about",
			title: "Tentang Kami",
			icon: "information-outline",
			route: "/about",
		},
	];

	// Helper untuk merender list agar tetap konsisten
	const renderMenuItems = (items: any[]) =>
		items.map((item) => (
			<TouchableOpacity
				key={item.id}
				activeOpacity={0.5}
				onPress={() => {
					if (item.isDarkModeToggle) {
						toggleTheme();
					} else if (item.route) {
						router.push(item.route as any);
					}
				}}>
				<List.Item
					title={item.title}
					left={() => <List.Icon icon={item.icon} />}
					right={() => (
						<View className="justify-center -mr-4">
							<List.Icon
								icon="chevron-right"
								color={theme.colors.outline}
								style={{ marginVertical: 0 }}
							/>
						</View>
					)}
				/>
			</TouchableOpacity>
		));

	return (
		<View
			className="flex-1"
			style={{ backgroundColor: theme.colors.background }}>
			<ScrollView showsVerticalScrollIndicator={false} className="px-5">
				{/* Profile Header */}
				<View className="items-center pt-5">
					<Avatar.Text size={85} label="GK" className="bg-primary" />
					<Text variant="headlineSmall" className="mt-4 font-bold">
						User Kopi Keliling
					</Text>
					<Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
						{session?.user?.email || "Pecinta Kopi Lokal"}
					</Text>
				</View>

				{/* Group 1: Pengaturan Akun */}
				<List.Section>
					<List.Subheader
						style={{ fontWeight: "bold", color: theme.colors.primary }}>
						Settings & Privacy
					</List.Subheader>
					{renderMenuItems(ACCOUNT_SETTINGS)}
				</List.Section>

				<Divider className="my-2" />

				{/* Group 2: Support & Info */}
				<List.Section>
					<List.Subheader
						style={{ fontWeight: "bold", color: theme.colors.primary }}>
						Support & Others
					</List.Subheader>
					{renderMenuItems(SUPPORT_INFO)}
				</List.Section>

				{/* Action Buttons */}
				<View className="mt-6 gap-y-2 mb-10">
					{session && (
						<Button
							onPress={logOut}
							mode="contained"
							icon="logout"
							labelStyle={{ color: colors.onPrimary }}>
							Logout
						</Button>
					)}

					<Button onPress={() => router.push("/")} mode="elevated">
						Login Balik
					</Button>
				</View>
			</ScrollView>
		</View>
	);
}
