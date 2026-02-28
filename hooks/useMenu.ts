import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// ✅ fetch categories
export const useMenuCategories = () => {
  return useQuery({
    queryKey: ["menu-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

// ✅ fetch menu items
export const useMenuItems = () => {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true);

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
