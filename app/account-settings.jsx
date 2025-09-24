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
      <Text>Account Page</Text>
      <Text>Current username: {username || "(not signed in)"}</Text>

      <View style={styles.inner}>
        {/* Change Username */}
        <TextInput
          style={styles.input}
          placeholder="New Username"
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={styles.button} onPress={change_Username}>
          <Text style={styles.buttonText}>Change Username</Text>
        </Pressable>

        {/* Change Password */}
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Repeat New Password"
          secureTextEntry
          value={repeatNewPassword}
          onChangeText={setRepeatNewPassword}
        />
        <Pressable style={styles.button} onPress={change_Password}>
          <Text style={styles.buttonText}>Change Pjassword</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={go_back}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});


