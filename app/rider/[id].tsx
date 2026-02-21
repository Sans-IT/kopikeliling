import { useAppTheme } from "@/context/ThemeContext";
import { useRiderSimulation } from "@/hooks/useRiderSimulation"; // Pakai hook yang sama
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Divider, List, Text } from "react-native-paper";

export default function RiderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { riders } = useRiderSimulation();
  const { theme } = useAppTheme();

  // CARI data rider berdasarkan ID dari list global
  const rider = riders.find((r) => r.id === String(id));

  if (!rider) return <Text>Rider tidak ditemukan...</Text>;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="items-center p-6">
        <Avatar.Text
          size={80}
          label={rider.name.substring(0, 2).toUpperCase()}
        />
        <Text variant="headlineMedium" className="mt-2 font-bold">
          {rider.name}
        </Text>
        <Text variant="titleMedium" className="font-bold">
          {rider.workStartTime} - {rider.workEndTime}
        </Text>
      </View>

      <View className="p-4">
        <Text variant="titleMedium" className="mb-4">
          Daftar Stok Kopi
        </Text>

        {/* Sekarang kita bisa ITERATE ke childnya dengan aman */}
        {rider.inventory?.map((item) => (
          <React.Fragment key={item.id}>
            <Divider />
            <List.Item
              title={item.name}
              description={`Rp ${item.price.toLocaleString()}`}
              left={(props) => <List.Icon {...props} icon="cup" />}
              right={() => (
                <Text className="self-center font-bold">{item.qty} Pcs</Text>
              )}
            />
          </React.Fragment>
        ))}

        {(!rider.inventory || rider.inventory.length === 0) && (
          <Text
            className="italic text-center mt-4"
            style={{ textAlign: "center" }}
          >
            Stok sedang kosong/diperbarui
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
