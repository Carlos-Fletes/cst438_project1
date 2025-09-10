import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { initDB, insertUser, getAllUsers } from "../lib/database"; // adjust if needed

export default function IndexPage() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        setDbReady(true);

        // Insert user if not exists
        await insertUser("testuser", "u001", "password123");

        // Get all users and log them
        const users = await getAllUsers();
        console.log("📦 Users in DB:", users);
      } catch (err) {
        console.log("❌ Setup error:", err.message);
      }
    };

    setup();
  }, []);

  return (
    <View style={styles.container}>
      {/* Local banner image */}
      <Image
        source={require("../assets/ComicOfTheDay.png")}
        style={styles.banner}
        resizeMode="cover"
      />

      <Text style={styles.text}>
        {dbReady ? "SQLite is ready!" : "Initializing..."}
      </Text>

      <Button title="Do Nothing" onPress={() => {}} />

      <Link href="/empty_page" style={styles.link}>
        Go to Empty Page (This is link)
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start", // content flows below the banner
    alignItems: "center",
    backgroundColor: "#fff",
  },
  banner: {
    width: "100%",   // full screen width
    height: 200,     // adjust for your desired banner size
    marginBottom: 20,
    borderRadius: 12, // optional rounded corners
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  link: {
    marginTop: 20,
    color: "blue",
  },
});
