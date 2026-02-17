import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function Register() {
  const router = useRouter();
  return (
    <View>
      <Button onPress={() => router.push("/login")}>Balik Ke login</Button>
    </View>
  );
}
