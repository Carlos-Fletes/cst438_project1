import { StyleSheet, Text, View, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FindUserByUsername,
  updateUsername,
  updatePassword,
} from "../lib/database";

const Account = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  useEffect(() => {
    const current = global?.myVar?.username;
    if (current) setUsername(current);
  }, []);

  const go_back = () => {
    router.push("/settings");
  };

  const change_Username = async () => {
    try {
      const current = username?.trim();
      const next = newUsername.trim();

      if (!current) {
        Alert.alert("Not signed in", "No current user found.");
        return;
      }
      if (!next) {
        Alert.alert("Invalid", "Please enter a new username.");
        return;
      }
      if (next === current) {
        Alert.alert("No change", "New username matches the current username.");
        return;
      }

      const taken = await FindUserByUsername(next);
      if (taken) {
        Alert.alert("Username taken", "Please choose a different username.");
        return;
      }

      const { ok, reason } = await updateUsername(current, next);
      if (!ok) {
        if (reason === "taken") {
          Alert.alert("Username taken", "Please choose a different username.");
        } else if (reason === "not_found") {
          Alert.alert("Error", "Current user not found.");
        } else {
          Alert.alert("Error", "Could not change username. Please try again.");
        }
        return;
      }

      setUsername(next);
      setNewUsername("");
      if (global?.myVar) global.myVar.username = next;

      Alert.alert("Success", "Username updated.");
      router.push("/settings");
    } catch (e) {
      console.error("change_Username error:", e);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const change_Password = async () => {
    try {
      const current = username?.trim();
      if (!current) {
        Alert.alert("Not signed in", "No current user found.");
        return;
      }
      if (!oldPassword || !newPassword || !repeatNewPassword) {
        Alert.alert("Missing fields", "Please fill out all password fields.");
        return;
      }
      if (newPassword !== repeatNewPassword) {
        Alert.alert("Mismatch", "New passwords do not match.");
        return;
      }
      if (oldPassword === newPassword) {
        Alert.alert("Invalid", "New password must be different from the old one.");
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert("Weak password", "Use at least 6 characters.");
        return;
      }

      const { ok, reason } = await updatePassword(current, oldPassword, newPassword);
      if (!ok) {
        if (reason === "wrong_old") {
          Alert.alert("Incorrect password", "Old password is incorrect.");
        } else if (reason === "not_found") {
          Alert.alert("Error", "User not found.");
        } else {
          Alert.alert("Error", "Could not change password. Please try again.");
        }
        return;
      }

      setOldPassword("");
      setNewPassword("");
      setRepeatNewPassword("");

      Alert.alert("Success", "Password updated.");
      router.push("/settings");
    } catch (e) {
      console.error("change_Password error:", e);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>
        Current username: <Text style={styles.mono}>{username || "(not signed in)"}</Text>
      </Text>

      <View style={styles.inner}>
        {/* Change Username */}
        <TextInput
          style={styles.input}
          placeholder="New Username"
          placeholderTextColor="#9e9e9e"
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={styles.buttonPrimary} onPress={change_Username}>
          <Text style={styles.buttonPrimaryText}>Change Username</Text>
        </Pressable>

        {/* Change Password */}
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          placeholderTextColor="#9e9e9e"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#9e9e9e"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Repeat New Password"
          placeholderTextColor="#9e9e9e"
          secureTextEntry
          value={repeatNewPassword}
          onChangeText={setRepeatNewPassword}
        />
        <Pressable style={styles.buttonPrimary} onPress={change_Password}>
          <Text style={styles.buttonPrimaryText}>Change Password</Text>
        </Pressable>

        <Pressable style={styles.buttonSecondary} onPress={go_back}>
          <Text style={styles.buttonSecondaryText}>Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
};

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
    alignItems: "center",
    gap: 0, // keeps RN compat; spacing handled by margins below
    paddingTop: 24,
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#131313",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 16,
    color: "#f5f5f5",
  },
  buttonPrimary: {
    width: "100%",
    height: 52,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  buttonPrimaryText: {
    color: "#0b0b0b",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonSecondary: {
    width: "100%",
    height: 52,
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