import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export const CheckLocationPermission = () => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <Text
        variant="headlineSmall"
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        Akses Lokasi Ditolak
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginBottom: 20,
          color: theme.colors.onSurfaceVariant,
        }}
      >
        Aplikasi membutuhkan izin lokasi untuk menampilkan peta dan mencari
        rider di sekitar Anda.
      </Text>
      <Button
        mode="contained"
        onPress={() => {
          Linking.openSettings();
        }}
      >
        Buka Pengaturan
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  overlayTop: { position: "absolute", top: 10, left: 10, right: 10 },
  overlayBottom: { position: "absolute", bottom: 10, right: 10 },
});
