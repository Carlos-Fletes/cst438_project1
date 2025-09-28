import { StyleSheet, Text, View, Pressable, TextInput, Alert } from "react-native";
import {Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FindUserByUsername,
  updateUsername,
  updatePassword,
} from "../lib/database";

const Account = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");

    const settings_About = () => {
        router.push('/empty_page');
    };
    const settings_Notifications = () => {
        router.push('/empty_page');
    };
    const settings_Account = () => {
        router.push('/account-settings');
    };

    useEffect(() => {
        const current = global?.myVar?.username;
        if (current) setUsername(current);
    }, []);

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Current username: <Text style={styles.mono}>{global?.myVar?.username || "Username"}</Text>
      </Text>

      <View style={styles.inner}>
        <Pressable style={styles.buttonPrimary} onPress={settings_Account}>
          <Text style={styles.buttonPrimaryText}>Account</Text>
        </Pressable>
        <Pressable style={styles.buttonPrimary} onPress={settings_Notifications}>
          <Text style={styles.buttonPrimaryText}>Notifications</Text>
        </Pressable>
        <Pressable style={styles.buttonSecondary} onPress={settings_About}>
          <Text style={styles.buttonSecondaryText}>About</Text>
        </Pressable>
      </View>
    </View>
  );
}
export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#d4d4d4",
    fontSize: 14,
    marginBottom: 16,
  },
  mono: {
    fontFamily: "Menlo",
  },
  inner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingTop: 24,
    gap: 0,
  },
  buttonPrimary: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPrimaryText: {
    color: "#0b0b0b",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonSecondary: {
    height: 56,
    backgroundColor: "transparent",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    marginTop: 4,
  },
  buttonSecondaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});