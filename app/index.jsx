import React, { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import RowCarousel from "../components/RowCarousel";
import { useAuth } from "../context/AuthContext";

// DB + User Data Imports
import {
  initDB,
  insertUser,
  getAllUsers,
  FindUserByUsername,
} from "../lib/database";
import {
  init_DB,
  insertUserData,
  getUserDataByUserId,
  getUserDataWithoutTimestamp,
  removeDuplicateUserData,
} from "../lib/UserComic";

export default function Home() {
  const { user } = useAuth();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        // Initialize both databases
        await initDB();
        await init_DB();
        setDbReady(true);

        // Insert user if not exists
        await insertUser('testuser', 'password123');
        await insertUser('keith', 'test');
        await insertUser('Admin','AdminPass')
      //  await insertUserData(FindUserByUsername('testuser'),'spiderman');
      //  console.log('User info: ', getUserDataByUserId(1))

        // Get all users and log them
        const users = await getAllUsers();
        console.log("📋 All Users:");
        users.forEach((u) =>
          console.log(`👤 Username: ${u.username}, Password: ${u.password}`)
        );

        await removeDuplicateUserData();

        // Log user_data (excluding timestamp)
        const allUserData = await getUserDataWithoutTimestamp();
        console.log("📊 All user_data (no created_at):", allUserData);

        const user1Data = await getUserDataByUserId(1);
        const user2Data = await getUserDataByUserId(2);
        console.log("🔍 Info for user_id 1:", user1Data.map((r) => r.info));
        console.log("🔍 Info for user_id 2:", user2Data.map((r) => r.info));
      } catch (err) {
        console.log("❌ Setup error:", err.message);
      }
    };

    setup();
  }, []);

  // Carousel data
  const make = (n, label) =>
    Array.from({ length: n }, (_, i) => ({
      id: `${label}-${i}`,
      title: `${label} #${i + 1}`,
      img: "https://via.placeholder.com/120x170.png?text=Comic",
    }));

  const recommended = useMemo(() => make(8, "Recommended"), []);
  const popular = useMemo(() => make(8, "Popular"), []);
  const favorites = useMemo(() => make(6, "Favorite"), []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.bannerWrap}>
        <Image
          source={require("../assets/ComicOfTheDay.png")}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      <RowCarousel title="Recommended" items={recommended} />
      <RowCarousel title="Popular" items={popular} />

      {user ? (
        <RowCarousel title="Favorites" items={favorites} />
      ) : (
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Favorites</Text>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaText}>Sign in to see your favorites here.</Text>
            <Link href="/signIn" asChild>
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bannerWrap: { paddingHorizontal: 12, paddingTop: 12 },
  banner: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
  cta: { marginTop: 8, paddingHorizontal: 12 },
  ctaTitle: { fontSize: 22, fontWeight: "700", marginBottom: 6, paddingHorizontal: 4 },
  ctaCard: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12,
    backgroundColor: "#fafafa", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  ctaText: { fontSize: 14, flex: 1, marginRight: 12 },
  ctaButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#007BFF", borderRadius: 8 },
  ctaButtonText: { color: "#fff", fontWeight: "600" },
});
