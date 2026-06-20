import { StyleSheet, Text, View } from "react-native";

export default function Home() {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inicio</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Balance disponible</Text>
        <Text style={styles.cardAmount}>C$ 0.00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#444",
  },
});
