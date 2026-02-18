import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";

export function useAuth() {
	const queryClient = useQueryClient();

	// 1. Query untuk mengambil session (Cache-based)
	const sessionQuery = useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const { data } = await supabase.auth.getSession();
			return data.session;
		},
		staleTime: Infinity,
	});

	const userId = sessionQuery.data?.user?.id;

	// 2. Query untuk mengambil profile (Role, Name, etc)
	const profileQuery = useQuery({
		queryKey: ["profile", userId],
		queryFn: async () => {
			if (!userId) return null;
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) throw error;
			return data;
		},
		enabled: !!userId,
		retry: 3,
	});

	// 3. Listener untuk sinkronisasi otomatis (Login/Logout)
	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				queryClient.setQueryData(["session"], session);
				if (!session) {
					queryClient.setQueryData(["profile", null], null);
				}
			},
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, [queryClient]);

	return {
		session: sessionQuery.data as Session | null,
		isLoading: sessionQuery.isLoading || profileQuery.isLoading,
		user: sessionQuery.data?.user ?? null,
		profile: profileQuery.data,
		role: profileQuery.data?.role ?? "GUEST",
		isAuthenticated: !!sessionQuery.data?.user,
	};
}
