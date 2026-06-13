import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor:  "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  image: {
    width: 360,
    height: 330,
    
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 15,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 50,
  },

  loginButton: {
    width: "100%",
    backgroundColor: "#2E9E47",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  registerButton: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#2E9E47",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  registerText: {
    color: "#2E9E47",
    fontSize: 16,
    fontWeight: "600",
  },
});