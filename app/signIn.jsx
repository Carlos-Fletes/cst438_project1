// app/signin.jsx
import { StyleSheet, Text, View } from "react-native";

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign In Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
