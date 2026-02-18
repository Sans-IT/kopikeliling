import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Divider, List } from "react-native-paper";
import { useAppTheme } from "../../context/ThemeContext";

export default function ListSettings() {
	const { isDark, toggleTheme, theme } = useAppTheme();
	const router = useRouter();

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
				}}
			>
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
		<View>
			{/* Group 1: Pengaturan Akun */}
			<List.Section>
				<List.Subheader
					style={{ fontWeight: "bold", color: theme.colors.primary }}
				>
					Settings & Privacy
				</List.Subheader>
				{renderMenuItems(ACCOUNT_SETTINGS)}
			</List.Section>

			<Divider className="my-2" />

			{/* Group 2: Support & Info */}
			<List.Section>
				<List.Subheader
					style={{ fontWeight: "bold", color: theme.colors.primary }}
				>
					Support & Others
				</List.Subheader>
				{renderMenuItems(SUPPORT_INFO)}
			</List.Section>
		</View>
	);
}
