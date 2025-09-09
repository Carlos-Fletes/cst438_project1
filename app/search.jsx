// app/search.jsx
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal,
  FlatList,
} from "react-native";

const GENRES = [
  { label: "Action", value: "action" },
  { label: "Adventure", value: "adventure" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Horror", value: "horror" },
  { label: "Sci-Fi", value: "sci-fi" },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [genreLabel, setGenreLabel] = useState("Select genre…");
  const [open, setOpen] = useState(false);

  const selectGenre = (g) => {
    setGenre(g.value);
    setGenreLabel(g.label);
    setOpen(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        {/* Search bar */}
        <TextInput
          style={styles.input}
          placeholder="Search comics…"
          autoCapitalize="none"
          returnKeyType="search"
          value={query}
          onChangeText={setQuery}
        />

        {/* Custom dropdown */}
        <Pressable
          style={[styles.select, !genre && styles.selectPlaceholder]}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.selectText}>{genreLabel}</Text>
          <Text style={styles.caret}>▾</Text>
        </Pressable>

        <Modal
          transparent
          visible={open}
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Choose a genre</Text>
              <FlatList
                data={GENRES}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.option}
                    onPress={() => selectGenre(item)}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </Pressable>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </Pressable>
        </Modal>

        {/* Year input */}
        <TextInput
          style={styles.input}
          placeholder="Year (e.g., 1998)"
          keyboardType="numeric"
          value={year}
          onChangeText={(t) => setYear(t.replace(/[^0-9]/g, "").slice(0, 4))}
          maxLength={4}
        />

        {/* Search button (UI only, no function yet) */}
        <Pressable style={styles.searchButton}>
          <Text style={styles.searchText}>Search</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { paddingTop: 16, paddingHorizontal: 16 },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  // Dropdown trigger
  select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectPlaceholder: { borderColor: "#ccc" },
  selectText: { fontSize: 16 },
  caret: { fontSize: 16, opacity: 0.7 },

  // Modal dropdown
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  option: { paddingVertical: 12, paddingHorizontal: 16 },
  optionText: { fontSize: 16 },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee",
    marginLeft: 16,
  },

  // Search button
  searchButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 6,
    alignItems: "center",
  },
  searchText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
