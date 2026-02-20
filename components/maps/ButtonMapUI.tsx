import { useAppTheme } from "@/context/ThemeContext";
import { Rider } from "@/lib/type";
import React from "react";
import { StyleSheet, View } from "react-native";
import { MapType } from "react-native-maps"; // Import tipe MapType
import { Button } from "react-native-paper";

interface ButtonMapUIProps {
  mapType: MapType;
  setMapType: React.Dispatch<React.SetStateAction<MapType>>;
  selectedRider: any; // Sesuaikan dengan tipe Rider kamu
  setSelectedRider: (rider: Rider | null) => void;
  setRouteCoords: (coords: any[]) => void;
}

export const ButtonMapUI = ({
  mapType,
  setMapType,
  selectedRider,
  setSelectedRider,
  setRouteCoords,
}: ButtonMapUIProps) => {
  const { theme } = useAppTheme();

  const toggleMapType = () => {
    setMapType((prev: MapType) => {
      if (prev === "standard") return "satellite";
      if (prev === "satellite") return "terrain";
      return "standard";
    });
  };

  return (
    <View style={styles.overlayBottom}>
      {selectedRider && (
        <Button
          mode="contained"
          onPress={() => {
            setSelectedRider(null);
            setRouteCoords([]);
          }}
          // Pakai warna error atau abu-abu gelap agar kontras dengan tombol utama
          style={{ backgroundColor: "#d32f2f", marginBottom: 10 }}
          labelStyle={{ color: "white" }}
          icon="close"
        >
          Batalkan Rute
        </Button>
      )}

      <Button
        mode="contained"
        onPress={toggleMapType}
        icon="map-outline"
        style={{ backgroundColor: theme.colors.primary }}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        {/* Mengubah tampilan teks agar lebih user-friendly */}
        {mapType === "standard"
          ? "Peta"
          : mapType === "satellite"
            ? "Satelit"
            : "Relief"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayBottom: {
    position: "absolute",
    bottom: 20, // Kasih jarak sedikit lebih tinggi dari pojok
    right: 16,
  },
});
