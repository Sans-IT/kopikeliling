import {
	ScrollView,
	View,
	Image,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { Avatar, Card, Text, IconButton, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

export default function Beranda() {
	const { theme } = useAppTheme();
	const { session } = useAuth();
	const router = useRouter();
	const carouselRef = useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);

	const user = session?.user;
	const displayName =
		user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
	const avatarUrl = user?.user_metadata?.avatar_url;

	const getAvatarLabel = () => displayName.substring(0, 2).toUpperCase();

	const onPressPagination = (index: number) => {
		carouselRef.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};

	// Helper Section Header Component
	const SectionHeader = ({
		title,
		subtitle,
	}: {
		title: string;
		subtitle?: string;
	}) => (
		<View className="flex-row justify-between items-end px-5 mb-3">
			<View>
				<Text variant="titleMedium" className="font-bold">
					{title}
				</Text>
				{subtitle && (
					<Text variant="labelSmall" style={{ color: theme.colors.outline }}>
						{subtitle}
					</Text>
				)}
			</View>
			<TouchableOpacity onPress={() => router.push("/menu")}>
				<Text
					variant="labelLarge"
					style={{ color: theme.colors.primary, fontWeight: "bold" }}
				>
					Lihat Semua
				</Text>
			</TouchableOpacity>
		</View>
	);

	const carouselData = [
		{ id: 1, image: require("@/assets/images/logo.png") },
		{ id: 2, image: require("@/assets/images/logo.png") },
		{ id: 3, image: require("@/assets/images/logo.png") },
	];

	return (
		<SafeAreaView
			className="flex-1"
			edges={["top", "left", "right"]}
			style={{ backgroundColor: theme.colors.background }}
		>
			{/* Simple Header */}
			<View className="flex-row items-center justify-between px-5 pb-2">
				<View className="flex-row items-center gap-x-3">
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => router.push("/profile")}
					>
						{avatarUrl ? (
							<Avatar.Image
								size={38}
								source={{ uri: avatarUrl }}
								style={{ backgroundColor: "transparent" }}
							/>
						) : (
							<Avatar.Text size={38} label={getAvatarLabel()} />
						)}
					</TouchableOpacity>
					<View>
						<Text variant="labelSmall" style={{ color: theme.colors.outline }}>
							Selamat Pagi,
						</Text>
						<Text variant="titleSmall" className="font-bold">
							{displayName}!
						</Text>
					</View>
				</View>
				<IconButton icon="bell-outline" size={24} onPress={() => {}} />
			</View>

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* 1. Main Carousel (Advanced) */}
				<View style={{ height: 210 }} className="mb-4">
					<Carousel
						ref={carouselRef}
						loop
						width={width}
						height={200}
						autoPlay={true}
						data={carouselData}
						scrollAnimationDuration={1000}
						onProgressChange={(_, absoluteProgress) => {
							progress.value = absoluteProgress;
						}}
						renderItem={({ item }) => (
							<View>
								<Card>
									<Image
										source={item.image}
										style={{ width: "100%", height: 180 }}
										resizeMode="contain"
									/>
								</Card>
							</View>
						)}
					/>
					<Pagination.Basic
						progress={progress}
						data={carouselData}
						dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
						activeDotStyle={{
							backgroundColor: theme.colors.primary,
							borderRadius: 50,
						}}
						containerStyle={{ gap: 5, marginTop: 10 }}
						onPress={onPressPagination}
					/>
				</View>

				{/* 2. Menu Spesial (Horizontal) */}
				<View className="mb-8">
					<SectionHeader title="Menu Spesial" />
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: 20,
							paddingBottom: 10,
							gap: 10,
						}}
					>
						{[1, 2, 3].map((i) => (
							<Card
								key={i}
								style={{
									width: 140,
									borderRadius: 16,
									backgroundColor: theme.colors.surface,
								}}
							>
								<Card.Cover
									source={{
										uri: `https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=300&sig=${i}`,
									}}
									style={{ height: 100 }}
								/>
								<Card.Content className="p-2">
									<Text
										variant="labelLarge"
										className="font-bold"
										numberOfLines={1}
									>
										Latte Art {i}
									</Text>
									<Text
										variant="labelSmall"
										style={{ color: theme.colors.primary }}
									>
										Rp 18.000
									</Text>
								</Card.Content>
							</Card>
						))}
					</ScrollView>
				</View>

				{/* 3. Diskon (Horizontal) */}
				<View className="mb-8">
					<SectionHeader title="Diskon Menarik" />
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: 20,
							paddingBottom: 10,
							gap: 10,
						}}
					>
						{[1, 2].map((i) => (
							<Card
								key={i}
								style={{
									width: 260,
									borderRadius: 16,
									backgroundColor: theme.colors.primaryContainer,
								}}
							>
								<View className="p-4 flex-row items-center gap-x-4">
									<Surface
										className="rounded-xl p-2"
										elevation={0}
										style={{ backgroundColor: theme.colors.primary }}
									>
										<IconButton
											icon="percent"
											iconColor="#fff"
											size={24}
											style={{ margin: 0 }}
										/>
									</Surface>
									<View className="flex-1">
										<Text variant="titleSmall" className="font-bold">
											Potongan Rp 10rb
										</Text>
										<Text variant="labelSmall">
											Min. belanja 50rb khusus hari ini.
										</Text>
									</View>
								</View>
							</Card>
						))}
					</ScrollView>
				</View>

				{/* 4. Apa yang Baru (Horizontal) */}
				<View className="mb-8">
					<SectionHeader title="Apa yang Baru?" />
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: 20,
							paddingBottom: 10,
							gap: 10,
						}}
					>
						{[1, 2, 3].map((i) => (
							<Surface
								key={i}
								className="rounded-2xl overflow-hidden"
								style={{ width: 180, height: 110 }}
							>
								<Image
									source={{
										uri: `https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&sig=${i + 10}`,
									}}
									style={{ width: "100%", height: "100%" }}
								/>
								<View
									className="absolute bottom-0 left-0 right-0 p-3"
									style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
								>
									<Text
										variant="labelMedium"
										className="text-white font-bold"
										style={{
											textShadowColor: "rgba(0, 0, 0, 0.75)",
											textShadowOffset: { width: -1, height: 1 },
											textShadowRadius: 10,
										}}
									>
										New Arrival {i}
									</Text>
								</View>
							</Surface>
						))}
					</ScrollView>
				</View>

				{/* 5. Menu Lain-lain (2 Columns Grid) */}
				<View className="px-5">
					<View className="flex-row justify-between items-center mb-4">
						<Text variant="titleMedium" className="font-bold">
							Menu Lainnya
						</Text>
						<TouchableOpacity
							onPress={() => router.push("/menu")}
							className="flex-row items-center"
						>
							<Text
								variant="labelLarge"
								style={{ color: theme.colors.outline }}
							>
								Ke Menu Selengkapnya
							</Text>
							<IconButton
								icon="chevron-right"
								size={20}
								style={{ margin: 0 }}
							/>
						</TouchableOpacity>
					</View>

					<View className="flex-row flex-wrap justify-between">
						{[1, 2, 3, 4].map((i) => (
							<View key={i} style={{ width: "48%" }} className="mb-4">
								<Card
									mode="elevated"
									style={{ borderRadius: 16, overflow: "hidden", elevation: 4 }}
								>
									{/* Header Gambar dengan Background halus */}
									<View
										className="items-center justify-center p-3"
										style={{ backgroundColor: theme.colors.surfaceVariant }}
									>
										<Image
											source={require("@/assets/images/logo.png")}
											style={{ width: 60, height: 60 }}
											resizeMode="contain"
										/>
									</View>

									<Card.Content className="p-3">
										<Text
											variant="titleSmall"
											numberOfLines={1}
											className="font-bold"
										>
											Menu Item {i}
										</Text>
										<Text
											variant="labelSmall"
											numberOfLines={1}
											style={{ color: theme.colors.outline }}
										>
											Kopi tradisional nikmat
										</Text>

										<View className="flex-row justify-between items-center mt-2">
											<Text
												variant="labelLarge"
												style={{
													color: theme.colors.primary,
													fontWeight: "700",
												}}
											>
												Rp 15.000
											</Text>
										</View>
									</Card.Content>
								</Card>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
