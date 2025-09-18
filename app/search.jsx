// app/search.jsx
import { useMemo, useState } from "react";
import { StyleSheet, View, TextInput, ScrollView } from "react-native";
import RowCarousel from "../components/RowCarousel";

// helpers to make placeholder items
const makeItems = (count, label) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${label}-${i}`,
    title: `${label} #${i + 1}`,
    img: `https://via.placeholder.com/120x170.png?text=Comic`,
  }));

export default function Browse() {
  const [query, setQuery] = useState("");

  const recommended = useMemo(() => makeItems(8, "Recommended"), []);
  const popular = useMemo(() => makeItems(8, "Popular"), []);

  const SearchBar = () => (
    <View style={styles.searchWrap}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search comics…"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <SearchBar />
      <RowCarousel title="Recommended" items={recommended} />
      <RowCarousel title="Popular" items={popular} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchWrap: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
