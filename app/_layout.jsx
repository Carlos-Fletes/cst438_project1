// app/_layout.jsx
import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { Link } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Link href="/signin" asChild>
            <Pressable>
              <Text style={{ color: "blue", fontSize: 16, marginRight: 10 }}>
                Sign In
              </Text>
            </Pressable>
          </Link>
        ),
      }}
    />
  );
}
