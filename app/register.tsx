import React, { useState } from "react";
import {
	Image,
	TouchableOpacity,
	View,
	TextInput,
	Alert,
	ScrollView,
} from "react-native";
import { Text, Button, ActivityIndicator, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import GoogleSignin from "@/components/login/GoogleSignin";
import { useAppTheme } from "@/context/ThemeContext";

export default function Register() {
	const router = useRouter();
	const { theme } = useAppTheme();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [loading, setLoading] = useState(false);

	async function signUpWithEmail() {
		if (!email || !password) {
			Alert.alert("Error", "Email dan Password wajib diisi!");
			return;
		}
		setLoading(true);
		const {
			data: { session },
			error,
		} = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName } },
		});

		if (error) {
			Alert.alert("Gagal Daftar", error.message);
		} else {
			if (!session) Alert.alert("Sukses", "Cek email untuk konfirmasi.");
			router.replace("/");
		}
		setLoading(false);
	}

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: theme.colors.background }}>
			{/* Menggunakan View yang sama dengan Login agar posisi fix */}
			<View className="flex-1 p-8 justify-center">
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
					{/* --- HEADER & LOGO (Sama persis sizenya) --- */}
					<View className="items-center mb-10">
						<Image
							source={require("@/assets/images/logo.png")}
							className="w-full h-48" // Sesuai login kamu (h-48)
							resizeMode="contain"
						/>
						<Text className="text-3xl font-bold mt-5 text-gray-800">
							Daftar
						</Text>
						<Text className="text-gray-500 mt-2 text-center">
							Silahkan buat akun Anda untuk{"\n"}mulai memesan kopi
						</Text>
					</View>

					{/* --- INPUT FORM --- */}
					<View className="gap-y-5 mb-6">
						<View className="border-b border-gray-300 pb-1">
							<Text className="text-xs text-gray-400 mb-1">Nama Lengkap</Text>
							<TextInput
								placeholder="Masukkan nama Anda"
								value={fullName}
								onChangeText={setFullName}
								className="text-lg text-gray-800"
							/>
						</View>

						<View className="border-b border-gray-300 pb-1">
							<Text className="text-xs text-gray-400 mb-1">Email</Text>
							<TextInput
								placeholder="Masukkan email Anda"
								value={email}
								onChangeText={setEmail}
								className="text-lg text-gray-800"
								autoCapitalize="none"
								keyboardType="email-address"
							/>
						</View>

						<View className="border-b border-gray-300 pb-1">
							<Text className="text-xs text-gray-400 mb-1">Password</Text>
							<TextInput
								placeholder="Masukkan password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								className="text-lg text-gray-800"
								autoCapitalize="none"
							/>
						</View>
					</View>

					{/* --- ACTION BUTTONS --- */}
					<View className="gap-4">
						<Button
							mode="contained"
							onPress={signUpWithEmail}
							disabled={loading}
							className="py-1 bg-[#1a2e35]"
							labelStyle={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
							{loading ? (
								<ActivityIndicator color="white" size="small" />
							) : (
								"Daftar"
							)}
						</Button>

						<View className="flex-row items-center my-2 mx-auto">
							<Text className="text-gray-400 text-xs uppercase">Atau</Text>
						</View>

						<GoogleSignin />
					</View>

					{/* --- FOOTER LINK --- */}
					<View className="flex-row justify-center mt-8">
						<Text className="text-gray-500">Sudah punya akun? </Text>
						<TouchableOpacity onPress={() => router.push("/")}>
							<Link href={"/login"} className="text-blue-600 font-bold">
								Masuk
							</Link>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>

			{/* --- BYPASS BUTTON --- */}
			<TouchableOpacity
				className="absolute top-14 right-6 p-2"
				onPress={() => router.push("/(tabs)/map")}>
				<Text className="text-gray-400 font-medium">Lewati {">"}</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
