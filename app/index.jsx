import React, { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
} from "react-native";
import { Link, useRouter } from "expo-router";
import RowCarousel from "../components/RowCarousel";
import { useAuth } from "../context/AuthContext";
import { getTodaysComic, getRandomComic, getComicByNumber, getFavoriteComics, getRecommendedComics, getPopularComics,getRandomComics } from "../lib/generalApi";

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
  const router = useRouter();
  const [dbReady, setDbReady] = useState(false);
  
  const [recommendedComics, setRecommendedComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [favoriteComics, setFavoriteComics] = useState([]);
  const [ComicOfTheDay, setComicOfTheDay] = useState(null);

  // Navigation function for carousel items
  const handleComicPress = (comic) => {
    console.log('📍 Navigating to comic:', comic.num);
    router.push({
      pathname: '/comicDetails',
      params: { comicNum: comic.num }
    });
  };

  useEffect(() => {
    const fetchComics = async () => {
      const todaysComic = await getTodaysComic();
      setComicOfTheDay(todaysComic);
      const popular = await getPopularComics();
      setPopularComics(popular);
      if (user && user.id) {
        const recommended = await getRecommendedComics(user.id);
        setRecommendedComics(recommended);
        const favorites = await getFavoriteComics(user.id);
        setFavoriteComics(favorites);
      } else {
        const randomComics = await getRandomComics(listLength);
        setRecommendedComics(randomComics);
        setFavoriteComics([]);
      }
    };
    
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
        key: comic ? `${label}-${comic.num}` : `${label}-placeholder-${i}`,
        num: comic ? comic.num : i + 1, // Include the comic number for navigation
      };
    });
  };

    
  const popular = useMemo(() => {
    if (popularComics && popularComics.length > 0) {
      return popularComics.map(comic => ({ 
        ...comic, 
        id: `popular-${comic.num}`,
        key: `popular-${comic.num}`
      }));
    }
    return make(listLength, "Popular");
  }, [popularComics]);
  
  const recommended = useMemo(() => {
    if (recommendedComics && recommendedComics.length > 0) {
      return recommendedComics.map(comic => ({ 
        ...comic, 
        id: `recommended-${comic.num}`,
        key: `recommended-${comic.num}`
      }));
    }
    return make(listLength, "Recommended");
  }, [recommendedComics]);
  
  const favorites = useMemo(() => {
    if (user) {
      if (favoriteComics && favoriteComics.length > 0) {
        return favoriteComics.map(comic => ({ 
          ...comic, 
          id: `favorite-${comic.num}`,
          key: `favorite-${comic.num}`
        }));
      }
      return make(favoriteComics.length, "Favorite");
    }
    return [];
  }, [favoriteComics, user]);

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

      <RowCarousel 
        title="Recommended" 
        items={recommended} 
        onItemPress={handleComicPress}
      />
      <RowCarousel 
        title="Popular" 
        items={popular} 
        onItemPress={handleComicPress}
      />

      {user ? (
        favoriteComics.length > 0 ? (
          <RowCarousel 
            title="Favorites" 
            items={favorites} 
            onItemPress={handleComicPress}
          />
        ) : (
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Favorites</Text>
            <View style={styles.ctaCard}>
              <Text style={styles.ctaText}>
                You haven't added any favorites yet. Start exploring and add some!
              </Text>
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
            <Text style={styles.ctaText}>
              Sign in to see your favorites here.
            </Text>
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
