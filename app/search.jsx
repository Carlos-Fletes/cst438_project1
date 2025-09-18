// app/search.jsx
import { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import Chip from "../components/Chip";
import RowCarousel from "../components/RowCarousel";

// helpers to make placeholder items
const makeItems = (count, label) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${label}-${i}`,
    title: `${label} #${i + 1}`,
    img: `https://via.placeholder.com/120x170.png?text=${encodeURIComponent("Comic")}`,
  }));

const GENRE_LIST = ["Action", "Adventure", "Fantasy", "Horror", "Sci-Fi", "Mystery", "Comedy", "Drama"];
const SORTS = ["Trending", "Newest", "Top Rated"];

export default function Browse() {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [sort, setSort] = useState(SORTS[0]);

  const recommended = useMemo(() => makeItems(8, "Recommended"), []);
  const popular = useMemo(() => makeItems(8, "Popular"), []);
  const genres = useMemo(
    () => GENRE_LIST.map((g, i) => ({
      id: `genre-${i}`,
      title: g,
      img: `https://via.placeholder.com/120x170.png?text=${encodeURIComponent(g)}`
    })),
    []
  );

  // Top filter bar: search + genre chips + sort (stub)
  const FilterBar = () => (
    <View style={styles.filters}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search comics…"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        autoCapitalize="none"
      />
      <FlatList
        horizontal
        data={GENRE_LIST}
        keyExtractor={(g) => g}
        renderItem={({ item }) => (
          <Chip
            label={item}
            selected={activeGenre === item}
            onPress={() => setActiveGenre(activeGenre === item ? "" : item)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12 }}
        style={{ marginTop: 10 }}
      />
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        <FlatList
          horizontal
          data={SORTS}
          keyExtractor={(s) => s}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSort(item)}
              style={[styles.sortPill, sort === item && styles.sortPillActive]}
            >
              <Text style={[styles.sortText, sort === item && styles.sortTextActive]}>
                {item}
              </Text>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );

  const renderCard = ({ item }) => (
    <Pressable style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.cover} />
      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
    </Pressable>
  );

  const Row = ({ title, data }) => (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Pressable><Text style={styles.seeAll}>See all ›</Text></Pressable>
      </View>
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12 }}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <FilterBar />
      <RowCarousel title="Recommended" items={recommended} />
      <RowCarousel title="Popular" items={popular} />
      <RowCarousel title="Genres" items={genres} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // filters
  filters: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  searchInput: {
    height: 44, borderWidth: 1, borderColor: "#ccc", borderRadius: 10,
    paddingHorizontal: 12, fontSize: 16, backgroundColor: "#fff",
  },
  sortRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  sortLabel: { marginRight: 8, fontWeight: "600" },
  sortPill: {
    paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: "#ccc",
    borderRadius: 12, marginRight: 8, backgroundColor: "#fff",
  },
  sortPillActive: { borderColor: "#007BFF", backgroundColor: "#E8F1FF" },
  sortText: { fontSize: 14 },
  sortTextActive: { color: "#007BFF", fontWeight: "600" },

  // (Kept for internal rows if you ever use local Row)
  row: { marginTop: 8, paddingHorizontal: 12 },
  rowHeader: {
    paddingHorizontal: 4, marginBottom: 6,
    flexDirection: "row", alignItems: "baseline", justifyContent: "space-between",
  },
  rowTitle: { fontSize: 22, fontWeight: "700" },
  seeAll: { color: "#007BFF", fontSize: 14 },

  card: { width: 120, marginRight: 12 },
  cover: { width: 120, height: 170, borderRadius: 8, backgroundColor: "#eee" },
  cardTitle: { marginTop: 6, fontSize: 12, width: 120 },
});
