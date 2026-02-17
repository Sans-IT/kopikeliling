import React from "react";
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

// Pastikan WebBrowser bisa menyelesaikan sesi
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignin() {
	const router = useRouter();
	const redirectTo = makeRedirectUri();

	const createSessionFromUrl = async (url: string) => {
		console.log("URL masuk:", url); // Cek apakah URL-nya beneran nyampe sini
		try {
			const { params, errorCode } = QueryParams.getQueryParams(url);
			if (errorCode) {
				console.error("Error Code:", errorCode);
				return;
			}

			const { access_token, refresh_token } = params;
			if (!access_token) {
				console.log("Token tidak ditemukan di URL");
				return;
			}

			const { data, error } = await supabase.auth.setSession({
				access_token,
				refresh_token,
			});

			if (error) throw error;
		} catch (err) {
			console.error("Gagal set session:", err);
		}
	};

	async function signInWithGoogle() {
		const { error, data } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo,
				skipBrowserRedirect: true,
			},
		});

		if (error) {
			console.error("OAuth Error:", error.message);
			return;
		}

		const res = await WebBrowser.openAuthSessionAsync(
			data?.url ?? "",
			redirectTo,
		);

		if (res.type === "success") {
			const { url } = res;
			await createSessionFromUrl(url);
		}
	}

	return (
		<Button
			icon="google"
			mode="outlined"
			onPress={signInWithGoogle}
			className="border-gray-300 border-[1px]"
			textColor="#444">
			Masuk dengan Google
		</Button>
	);
}
