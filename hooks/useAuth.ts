import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";

export function useAuth() {
  const queryClient = useQueryClient();

  // 1. Query Session
  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: Infinity, // Tetap di cache selama aplikasi jalan
  });

  const userId = sessionQuery.data?.user?.id;

  // 2. Query Profile
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
    enabled: !!userId, // Hanya fetch jika ada userId
    staleTime: 1000 * 60 * 5, // Cache profile selama 5 menit
  });

  // 3. Listener Auth State
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Update session di cache
        queryClient.setQueryData(["session"], session);

        if (session) {
          // Jika ada login/re-auth, ambil ulang profile
          queryClient.invalidateQueries({
            queryKey: ["profile", session.user.id],
          });
        } else {
          // Jika logout, bersihkan cache profile dan navigasi reset
          queryClient.clear(); // Bersihkan semua cache biar aman dari sisa data user lama
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    session: sessionQuery.data as Session | null,
    user: sessionQuery.data?.user ?? null,
    profile: profileQuery.data,
    role: profileQuery.data?.role ?? "GUEST",
    isLoading: sessionQuery.isLoading || (!!userId && profileQuery.isLoading),
    isAuthenticated: !!sessionQuery.data?.user,
  };
}
