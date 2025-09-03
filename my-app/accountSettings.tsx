import { Stack } from "expo-router";
import React from "react";
import { View, Text, Button } from "react-native";

export default function AccountSettingsScreen() {
  const username = "Guest"; // placeholder until we make accounts

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen options={{ title: "Account Settings" }} />

      <Text>Current username: {username}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Change Username" onPress={() => {}} />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button title="Change Password" onPress={() => {}} />
      </View>
    </View>
  );
}
