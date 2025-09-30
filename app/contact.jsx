import { StyleSheet, Text, View, Pressable, TextInput, Alert, Platform} from "react-native";
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
        router.push('/about');
    };
    const settings_Favorites = () => {
        router.push('/favorites');
    };
    const settings_SignOut = () => {
      router.push('/contact');
    };
    const settings_Contact = () => {
        router.push('/contact');
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
      <Text style={styles.title}>Contact</Text>

      
      

      <Text style={styles.title2}>Don't contact us</Text>
    </View>
  );
}
export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#596a88ff",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  title2: {
    color: "#ffffff",
    fontSize: 50,
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
    borderColor: "#ffffff",
    marginBottom: 12,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonTertiary: {
    height: 56,
    backgroundColor: "transparent",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
    marginTop: 4,
  },
  buttonTertiaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});