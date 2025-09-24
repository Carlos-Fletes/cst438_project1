// app/_layout.jsx
import { Stack, Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import 'regenerator-runtime/runtime'
import { AuthProvider, useAuth } from "../context/AuthContext";

function HeaderRight() {
  const { user } = useAuth();

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* Search Icon */}
      <Link href="/search" asChild>
        <Pressable style={{ paddingHorizontal: 10 }}>
          <Ionicons name="search" size={22} />
        </Pressable>
      </Link>

      {/* Username or Sign In */}
      {user ? (
        <Link href="/settings" asChild>
          <Pressable>
            <Text style={{ marginRight: 10, fontSize: 16, fontWeight: "bold", color: "blue" }}>
              {user.username}
            </Text>
          </Pressable>
        </Link>
      ) : (
        <Link href="/signIn" asChild>
          <Pressable>
            <Text style={{ color: "blue", fontSize: 16, marginRight: 10 }}>Sign In</Text>
          </Pressable>
        </Link>
      )}
    </View>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home", headerRight: () => <HeaderRight /> }} />
        <Stack.Screen name="empty_page" options={{ headerRight: () => <HeaderRight /> }} />
        <Stack.Screen name="signIn" options={{ headerRight: () => null }} />
        <Stack.Screen name="tempSettings" options={{ title: "Settings", headerRight: () => <HeaderRight /> }} />
        <Stack.Screen name="search" options={{ title: "Browse", headerRight: () => null }} />
      </Stack>
    </AuthProvider>
  );
}

