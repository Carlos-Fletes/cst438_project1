// components/Chip.jsx
import { Pressable, Text, StyleSheet } from "react-native";

export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : null]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  chipSelected: {
    borderColor: "#007BFF",
    backgroundColor: "#E8F1FF",
  },
  text: { fontSize: 14 },
  textSelected: { color: "#007BFF", fontWeight: "600" },
});
