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

import { useEffect } from "react/cjs/react.development";




export default function Browse() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [popularComics, setPopularComics] = useState(null);
  const [recommendedComics, setRecommendedComics] = useState(null);
  const [loading, setLoading] = useState(false);


  const listLength = 10;

  const setup = async () => {
    setLoading(true);
    const popular = await getPopularComics();
    setPopularComics(popular);
    if (user) {
      const [recommended] = await Promise.all([
        getRecommendedComics(user.id),
      ]);
      setRecommendedComics(recommended);
    } else {
      const randomComics = await getRandomComics(listLength);
      setRecommendedComics(randomComics);
    }
    setLoading(false);
  };

  useEffect(() => {
    setup();
  }, []);

  const makeItems = (n, label) => {
    return Array.from({ length: n }, (_, i) => {
      let comic;
      if (label === "Recommended" && recommendedComics && recommendedComics[i]) {
        comic = recommendedComics[i];
      } else if (label === "Popular" && popularComics && popularComics[i]) {
        comic = popularComics[i];
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
