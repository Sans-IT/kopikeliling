import ListSettings from "@/components/profile/ListSettings";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useAppTheme } from "../../context/ThemeContext";

export default function ProfileScreen() {
  const { theme } = useAppTheme();
  const { colors } = useTheme();
  const router = useRouter();
  const { session } = useAuth();

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="px-5">
        {/* Profile Header */}
        <ProfileHeader />

        {/* List Settings */}
        <ListSettings />

        {/* Action Buttons */}
        <View className="mt-6 gap-y-2 mb-5">
          {session && (
            <Button
              onPress={logOut}
              mode="contained"
              icon="logout"
              labelStyle={{ color: colors.onPrimary }}
            >
              Logout
            </Button>
          )}

          <Button onPress={() => router.push("/")} mode="elevated">
            Login Balik
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
