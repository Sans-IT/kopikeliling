import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Tahan splash screen agar tidak auto-hide
SplashScreen.preventAutoHideAsync();

export default function Index() {
	const { session, isLoading } = useAuth();
	const [isAppReady, setIsAppReady] = useState(false);

	useEffect(() => {
		// Jika proses cek session (auth) sudah selesai
		if (!isLoading) {
			setIsAppReady(true);
			SplashScreen.hideAsync(); // Baru lepas splash screen-nya
		}
	}, [isLoading]);

	// Selama auth masih nge-cek, biarkan layar Splash tetap tampil
	if (!isAppReady) {
		return null;
	}

	// Jika session tidak ada (belum login), lempar ke register
	if (!session) {
		return <Redirect href="/register" />;
	}

	// Jika session ada (sudah login), lempar ke tabs beranda
	return <Redirect href="/(tabs)/beranda" />;
}
