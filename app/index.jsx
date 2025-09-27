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
import { getTodaysComic, getRandomComic, getComicByNumber, getFavoriteComics, getRecommendedComics, getPopularComics } from "../lib/generalApi";

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

const listLength = 10;


export default function Home() {
  const { user } = useAuth();
  const [dbReady, setDbReady] = useState(false);
  
  const [recommendedComics, setRecommendedComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [ComicOfTheDay, setComicOfTheDay] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      const todaysComic = await getTodaysComic();
      setComicOfTheDay(todaysComic);
      const popular = await getPopularComics();
      setPopularComics(popular);
      if(user){
        const favorites = await getFavoriteComics(user.id);
        setFavoriteComics(favorites);
        const recommended = await getRecommendedComics(user.id);
        setRecommendedComics(recommended);
      } else {
        setFavoriteComics([]);
        for (let i = 0; i < listLength; i++) {
          const randomComic = await getRandomComic();
          setRecommendedComics((prev) => [...prev, randomComic]);
        }
      }
    };
    
    const setup = async () => {
      try {
        // Initialize both databases
        await initDB();
        await init_DB();
        setDbReady(true);

        // Seed test users
        await insertUser("testuser", "password123");
        await insertUser("Admin", "AdminPass");

        // Insert user data
        const adminUser = await FindUserByUsername("Admin");
        if (adminUser) {
          await insertUserData(adminUser.id, 42);
        }

        const testUser = await FindUserByUsername("testuser");
        if (testUser) {
          await insertUserData(testUser.id, 28);
        }

        // Log all users
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

        // Fetch comics
        await fetchComics();

      } catch (err) {
        console.log("❌ Setup error:", err.message);
      }
    };

    
    setup();
  }, []);

  //placeholder information
  // Carousel data
  // const make = (n, label) =>
  //   Array.from({ length: n }, (_, i) => ({
  //     id: `${label}-${i}`,
  //     title: `${label} #${i + 1}`,
  //     img: "https://via.placeholder.com/120x170.png?text=Comic",
  //   }));

  const make = (n, label) => {
    return Array.from({ length: n }, (_, i) => {
      let comic;
      if (label === "Recommended" && recommendedComics && recommendedComics[i]) {
        comic = recommendedComics[i];
      } else if (label === "Popular" && popularComics && popularComics[i]) {
        comic = popularComics[i];
      } else if (label === "Favorite" && favoriteComics && favoriteComics[i]) {
        comic = favoriteComics[i];
      }
      return {
        id: comic ? `${label}-${comic.num}` : `${label}-placeholder-${i}`,
        title: comic ? comic.title : `${label} #${i + 1}`,
        img: comic ? comic.img : "https://via.placeholder.com/120x170.png?text=Comic",
      };
    });
  };

    
  var popular = useMemo(() => popularComics || make(listLength, "Popular"), [popularComics]);
  var recommended = useMemo(() => recommendedComics || make(listLength, "Recommended"), [recommendedComics]);
  if(user){
    var favorites = useMemo(() => favoriteComics || make(favoriteComics.length, "Favorite"), [favoriteComics]);
  } else {
    var favorites = [];
  }

    //placeholder images
  // const recommended = useMemo(() => make(8, "Recommended"), []);
  // const popular = useMemo(() => make(8, "Popular"), []);
  // const favorites = useMemo(() => make(6, "Favorite"), []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.bannerWrap}>
        <Image
          source={{ uri: ComicOfTheDay ? ComicOfTheDay.img : "https://via.placeholder.com/600x200.png?text=Comic+of+the+Day" }}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      <RowCarousel title="Recommended" items={recommended} />
      <RowCarousel title="Popular" items={popular} />

      {user ? (
        favoriteComics.length > 0 ? (
          <RowCarousel title="Favorites" items={favorites} />
        ) : (
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Favorites</Text>
            <View style={styles.ctaCard}>
              <Text style={styles.ctaText}>You haven't added any favorites yet. Start exploring and add some!</Text>
              <Link href="/search" asChild>
                <Pressable style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Browse Comics</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        ) 
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
