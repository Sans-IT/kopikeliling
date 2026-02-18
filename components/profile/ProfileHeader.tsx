import { View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useAuth } from "@/hooks/useAuth";
import { useAppTheme } from "../../context/ThemeContext";

export default function ProfileHeader() {
	const { theme } = useAppTheme();
	const { session } = useAuth();

	const userEmail = session?.user?.email;
	const displayName =
		session?.user?.user_metadata?.full_name || "User Kopi Keliling";

	const getAvatarLabel = () => {
		if (userEmail) return userEmail.substring(0, 2).toUpperCase();
		if (displayName) return displayName.substring(0, 2).toUpperCase();
		return "KK";
	};

	const avatarUrl = session?.user?.user_metadata?.avatar_url;

	return (
		<View className="items-center pt-5">
			{avatarUrl ? (
				<Avatar.Image
					size={85}
					source={{ uri: avatarUrl }}
					style={{ backgroundColor: "transparent" }}
				/>
			) : (
				<Avatar.Text
					size={85}
					label={getAvatarLabel()}
					style={{ backgroundColor: theme.colors.primary }}
				/>
			)}

			<Text variant="headlineSmall" className="mt-4 font-bold">
				{displayName}
			</Text>

			<Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
				{userEmail || "Pecinta Kopi Lokal"}
			</Text>
		</View>
	);
}
