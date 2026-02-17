import React, { useState } from "react";
import { Image, TouchableOpacity, View, TextInput, Alert } from "react-native";
import { Text, Button, ActivityIndicator, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import GoogleSignin from "@/components/login/GoogleSignin"; // Import komponen Google kita
import { useAuth } from "@/hooks/useAuth";
import { useAppTheme } from "@/context/ThemeContext";

export default function Login() {
	const router = useRouter();
	const { theme } = useAppTheme();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { session } = useAuth();

	// Fungsi Masuk (Sign In dengan Email)
	async function signInWithEmail() {
		if (!email || !password) {
			Alert.alert("Error", "Email dan Password wajib diisi!");
			return;
		}

		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			Alert.alert("Gagal Masuk", error.message);
		}
		setLoading(false);
	}

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: theme.colors.background }}>
			<View className="flex-1 p-8 justify-center">
				{/* --- HEADER & LOGO --- */}
				<View className="items-center mb-10">
					<Image
						source={require("@/assets/images/logo.png")} // Pastikan file logo ada di sini
						className="w-full h-48"
						resizeMode="contain"
					/>
					<Text
						className="text-3xl font-bold mt-5"
						style={{ fontWeight: "bold" }}>
						Login
					</Text>
					<Text className="text-gray-500 mt-2 text-center">
						Selamat Datang {session?.user.email} di KopiKeliling{"\n"}Silahkan
						masuk ke akun Anda
					</Text>
				</View>

				{/* --- INPUT FORM --- */}
				<View className="gap-y-5 mb-6">
					<View className="border-b border-gray-300 pb-1">
						<Text className="text-xs text-gray-400 mb-1">Email / Username</Text>
						<TextInput
							placeholder="Masukkan email Anda"
							value={email}
							onChangeText={(text) => setEmail(text)}
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
							onChangeText={(text) => setPassword(text)}
							secureTextEntry
							className="text-lg text-gray-800"
							autoCapitalize="none"
						/>
					</View>

					<TouchableOpacity className="items-end">
						<Link href={"/login"} className="font-semibold">
							Lupa Password?
						</Link>
					</TouchableOpacity>
				</View>

				{/* --- ACTION BUTTONS --- */}
				<View className="gap-4">
					{/* Tombol Login Manual */}
					<Button
						mode="contained"
						onPress={signInWithEmail}
						disabled={loading}
						className="py-1 bg-[#1a2e35]" // Warna dark navy sesuai desain
						labelStyle={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
						{loading ? (
							<ActivityIndicator color="white" size="small" />
						) : (
							"Masuk"
						)}
					</Button>

					{/* Pemisah (Divider) */}
					<View className="flex-row items-center my-2 mx-auto">
						<Divider />
						<Text className="mx-4 text-gray-400 text-xs uppercase">Atau</Text>
						<Divider />
					</View>

					{/* Tombol Google dari Komponen Terpisah */}
					<GoogleSignin />
				</View>

				{/* --- FOOTER LINK --- */}
				<View className="flex-row justify-center mt-8">
					<Text className="text-gray-500">Belum punya akun? </Text>
					<TouchableOpacity onPress={() => router.push("/(tabs)/map")}>
						<Link href={"/register"} className="text-blue-600 font-bold">
							Daftar Sekarang
						</Link>
					</TouchableOpacity>
				</View>
			</View>

			{/* --- BYPASS BUTTON (Pojok Kanan Atas) --- */}
			<TouchableOpacity
				className="absolute top-14 right-6 p-2"
				onPress={() => router.push("/(tabs)/map")}>
				<Text className="text-gray-400 font-medium">Lewati {">"}</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
