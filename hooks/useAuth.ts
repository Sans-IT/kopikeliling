import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";

export function useAuth() {
  const queryClient = useQueryClient();

  // 1. Query untuk mengambil session (Cache-based)
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: Infinity, // Session dianggap "segar" terus kecuali di-invalidate
  });

  // 2. Listener untuk sinkronisasi otomatis (Login/Logout)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Update cache TanStack secara manual saat status berubah
        queryClient.setQueryData(["session"], session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    session: query.data as Session | null,
    isLoading: query.isLoading,
    user: query.data?.user ?? null,
    isAuthenticated: !!query.data?.user,
  };
}
