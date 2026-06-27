import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#222",
  },

  input: {
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  registerButton: {
    backgroundColor: "#0ca147",
    padding: 18,
    borderRadius: 30,
    marginTop: 10,
  },

  registerButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

  dateContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F3F4F6",
  borderRadius: 12,
  padding: 15,
  marginBottom: 15,
},

dateText: {
  marginLeft: 10,
  color: "#888",
  fontSize: 16,
},
});