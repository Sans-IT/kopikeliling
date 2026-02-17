import * as React from "react";
import { ScrollView } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useAppTheme } from "@/context/ThemeContext";

export default function News() {
  const { theme } = useAppTheme();

  return (
    <ScrollView
      className="flex-1 p-5"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Card
        mode="elevated"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Card.Title title="Card Title" subtitle="Card Subtitle" />
        <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
        <Card.Content className="p-5">
          <Text variant="titleLarge">Card title</Text>
          <Text variant="bodyMedium">Card content</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
