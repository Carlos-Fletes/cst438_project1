// app/search.jsx
import { useMemo, useState } from "react";
import { StyleSheet, View, TextInput, ScrollView } from "react-native";
import RowCarousel from "../components/RowCarousel";

import { useAuth } from "../context/AuthContext";
import {
  getPopularComics,
  getRecommendedComics,
  getRandomComics,
  getRandomComic,
  getComicByNumber,
} from "../lib/generalApi";

import { useEffect } from "react";
import { init_DB } from "../lib/UserComic";

import { useNavigation } from "@react-navigation/native";




export default function Browse() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [popularComics, setPopularComics] = useState(null);
  const [recommendedComics, setRecommendedComics] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();


  const listLength = 10;

  const setup = async () => {
    setLoading(true);
    await init_DB();
    // Fetch popular comics
    const popular = await getPopularComics();
    setPopularComics(popular);

    // Fetch recommended comics based on user status
    try {
      if (user && user.id) {
        // If user is logged in, fetch personalized recommendations
        const recommended = await getRecommendedComics(user.id);
        setRecommendedComics(recommended);
      } else {
        // If no user, fetch random comics
        const randomComics = await getRandomComics(listLength);
        setRecommendedComics(randomComics);
      }
    } catch (error) {
      console.error("Error fetching recommended comics:", error);
      setRecommendedComics([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    setup();
  }, []);

  const makeItems = (n, label) => {
    const recommendedArr = recommendedComics || [];
    const popularArr = popularComics || [];
    return Array.from({ length: n }, (_, i) => {
      let comic;
      if (label === "Recommended" && recommendedArr[i]) {
        comic = recommendedArr[i];
      } else if (label === "Popular" && popularArr[i]) {
        comic = popularArr[i];
      }
      return {
        id: comic ? `${label}-${comic.num}` : `${label}-placeholder-${i}`,
        title: comic ? comic.title : `${label} #${i + 1}`,
        img: comic ? comic.img : "https://via.placeholder.com/120x170.png?text=Comic",
      };
    });
  };

  const popular = useMemo(() => popularComics || makeItems(listLength, "Popular"), [popularComics]);
  const recommended = useMemo(() => recommendedComics || makeItems(listLength, "Recommended"), [recommendedComics]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.searchWrap} key="search-wrap">
        <TextInput
          style={styles.searchInput}
          placeholder="Search comics…"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCapitalize="none"
          onSubmitEditing={() => {
            // Handle search submission (e.g., navigate to search results)
            if (query.trim()) {
              // Assuming you use React Navigation
              // and comicDetails.jsx is registered as "comicDetails" route
              // Pass the query as a param
              navigation.navigate("comicDetails", { comicNum: query.trim() });
            }
            //console.log("Search submitted:", query);
          }}
        />
      </View>
      <RowCarousel title="Recommended" items={recommended} key="recommended" />
      <RowCarousel title="Popular" items={popular} key="popular" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchWrap: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  searchInput: {
    height: 44, borderWidth: 1, borderColor: "#ccc", borderRadius: 10,
    paddingHorizontal: 12, fontSize: 16, backgroundColor: "#fff",
  },
});
