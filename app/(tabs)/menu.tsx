import React from "react";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { Card, Text, Surface, IconButton } from "react-native-paper";
import { useAppTheme } from "@/context/ThemeContext";

// Data Menu dengan Harga
const MENU_DATA = [
  { id: "1", title: "Burger Premium", desc: "Daging wagyu asli", price: 45000 },
  { id: "2", title: "Pizza Italian", desc: "Tipis dan renyah", price: 65000 },
  { id: "3", title: "Pasta Carbonara", desc: "Krim susu asli", price: 38000 },
  { id: "4", title: "Iced Caramel", desc: "Kopi arabika", price: 25000 },
];

export default function Menu() {
  const { theme } = useAppTheme();

  // Helper untuk format Rupiah
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const renderItem = ({ item }: { item: (typeof MENU_DATA)[number] }) => (
    <View className="flex-1 m-2">
      <TouchableOpacity activeOpacity={0.8}>
        <Card
          mode="elevated"
          style={{ borderRadius: 16, overflow: "hidden", elevation: 4 }}
        >
          {/* Header Gambar dengan Background halus */}
          <View
            className="items-center justify-center p-4"
            style={{ backgroundColor: theme.colors.surfaceVariant }}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>

          <Card.Content className="p-3">
            <Text variant="titleMedium" numberOfLines={1} className="font-bold">
              {item.title}
            </Text>
            <Text
              variant="bodySmall"
              numberOfLines={1}
              style={{ color: theme.colors.outline }}
            >
              {item.desc}
            </Text>

            {/* Bagian Harga & Action */}
            <View className="flex-row justify-between items-center mt-3">
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.primary, fontWeight: "700" }}
              >
                {formatCurrency(item.price)}
              </Text>

              {/* Tombol Tambah Kecil */}
              <Surface
                style={{
                  borderRadius: 8,
                  backgroundColor: theme.colors.primaryContainer,
                }}
                elevation={0}
              >
                <IconButton
                  icon="plus"
                  size={16}
                  iconColor={theme.colors.onPrimaryContainer}
                  onPress={() => console.log("Added", item.title)}
                />
              </Surface>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header Sederhana */}
      <View className="px-5 pt-8 pb-2">
        <Text variant="headlineSmall" className="font-bold">
          Pilih Menu
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          Total {MENU_DATA.length} item tersedia
        </Text>
      </View>

      <FlatList
        data={MENU_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }} // paddingBottom agar tidak tertutup footer
        showsVerticalScrollIndicator={false}
      />

      {/* FOOTER TOTAL HARGA (Floating) */}
      <Surface
        className="absolute bottom-0 left-0 right-0 p-5 flex-row justify-between items-center"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          elevation: 20,
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <View>
          <Text variant="labelLarge" style={{ color: theme.colors.outline }}>
            Total Bayar
          </Text>
          <Text
            variant="headlineSmall"
            className="font-bold"
            style={{ color: theme.colors.primary }}
          >
            {formatCurrency(173000)} {/* Contoh total statis */}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: theme.colors.onPrimary, fontWeight: "bold" }}>
            Checkout
          </Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );
}
