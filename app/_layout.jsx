
// app/_layout.jsx
import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

function HeaderRight() {
  const { user } = useAuth();

  if (user) {
    return (
      <Text style={{ marginRight: 10, fontSize: 16, fontWeight: "bold" }}>
        {user.username}
      </Text>
    );
  }

  //Sign in button set-up
  return (
    <Link href="/signIn" asChild>
      <Pressable>
        <Text style={{ color: "blue", fontSize: 16, marginRight: 10 }}>
          Sign In
        </Text>
      </Pressable>
    </Link>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerRight: () => <HeaderRight /> }}
        />
        <Stack.Screen
          name="empty_page"
          options={{ headerRight: () => <HeaderRight /> }}
        />
        {/*Sign in button at top-right*/}
        <Stack.Screen name="signIn" options={{ headerRight: () => null }} />
      </Stack>
    </AuthProvider>
  );
}

