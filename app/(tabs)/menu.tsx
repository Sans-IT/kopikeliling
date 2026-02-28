import { useAppTheme } from "@/context/ThemeContext";
import { useMenuCategories, useMenuItems } from "@/hooks/useMenu";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, Card, Searchbar, Text } from "react-native-paper";

export default function Menu() {
  const { theme } = useAppTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories, isLoading: catLoading } = useMenuCategories();
  const { data: menus, isLoading: menuLoading, refetch } = useMenuItems();

  // ✅ format rupiah
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // ✅ FILTER LOGIC (IMPORTANT)
  const filteredMenu = useMemo(() => {
    if (!menus) return [];

    return menus.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory
        ? item.category_id === selectedCategory
        : true;

      return matchSearch && matchCategory;
    });
  }, [menus, searchQuery, selectedCategory]);

  const renderItem = ({ item }: any) => (
    <View style={{ width: "50%", padding: 8 }}>
      <Card style={{ borderRadius: 16, overflow: "hidden", elevation: 4 }}>
        <View
          className="items-center justify-center p-4"
          style={{ backgroundColor: theme.colors.surfaceVariant }}
        >
          <Image
            source={
              item.imageUrl
                ? { uri: item.imageUrl }
                : require("@/assets/images/logo.png")
            }
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>

        <Card.Content className="p-3">
          <Text variant="titleMedium" numberOfLines={1} className="font-bold">
            {item.name}
          </Text>

          <Text
            variant="bodySmall"
            numberOfLines={1}
            style={{ color: theme.colors.outline }}
          >
            {item.description}
          </Text>

          <View className="flex-row justify-between items-center mt-3">
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              {formatCurrency(item.price)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  // 🔥 loading state
  if (catLoading || menuLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="gap-2">
        {/* 🔍 SEARCH */}
        <Searchbar
          placeholder="Cari menu..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ borderRadius: 0 }}
        />

        {/* 🧭 CATEGORY TOGGLE */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 8,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            className="mr-2 px-4 py-2 rounded-full"
            style={{
              backgroundColor: !selectedCategory
                ? theme.colors.primary
                : theme.colors.surfaceVariant,
            }}
          >
            <Text style={{ color: !selectedCategory ? "#fff" : undefined }}>
              Semua
            </Text>
          </TouchableOpacity>

          {categories?.map((cat) => {
            const active = selectedCategory === cat.name;

            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                className="mr-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: active
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant,
                }}
              >
                <Text style={{ color: active ? "#fff" : undefined }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 📦 MENU GRID */}
        <FlatList
          data={filteredMenu}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 8,
          }}
          refreshControl={
            <RefreshControl
              refreshing={menuLoading}
              onRefresh={() => refetch()}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="mt-10" style={{ textAlign: "center" }}>
              Menu {`"${searchQuery}"`} tidak ditemukan {selectedCategory}
            </Text>
          }
        />
      </View>
    </View>
  );
}
