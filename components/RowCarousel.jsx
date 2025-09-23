// components/RowCarousel.jsx
import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";

export default function RowCarousel({ title, items, onSeeAll }) {
  const renderItem = ({ item }) => (
    <Pressable style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.cover} />
      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll}>
            <Text style={styles.seeAll}>See all ›</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: 8, paddingHorizontal: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, paddingHorizontal: 4 },
  title: { fontSize: 22, fontWeight: "700" },
  seeAll: { color: "#007BFF", fontSize: 14 },
  card: { width: 120, marginRight: 12 },
  cover: { width: 120, height: 170, borderRadius: 8, backgroundColor: "#eee" },
  cardTitle: { marginTop: 6, fontSize: 12, width: 120 },
});
