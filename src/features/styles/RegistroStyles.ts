import { StyleSheet } from "react-native";

export const registroStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F7F5FF",
    gap: 20,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    gap: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3D3D3D",
  },
});
