// app/signin.jsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {FindUser, FindPassword, FindUserByUsername} from '../lib/database';
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  //Set default sign in settings on start-up
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();
  //For now, sign in process
 const handleSignIn = async () => {
  try {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
    const storedPassword = await FindPassword(username);
    const storedUser = await FindUser(username);

    if (storedUser && password === storedPassword) {
      signIn(username);
      Alert.alert("Success", "Signed in successfully!");
      global.myVar= await FindUserByUsername(username);
      console.log(global.myVar.id);
      router.back();
    } else {
      Alert.alert("Error", "Invalid username or password.");
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    Alert.alert("Error", "Something went wrong.");
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/*Show username and password when nothing is entered*/}
      <View style={styles.inner}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

//Styles
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
