import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#222",
  },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  loginButton: {
    backgroundColor: "#57B52C",
    padding: 18,
    borderRadius: 30,
    marginTop: 10,
  },

  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  separatorText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 25,
  },

 socialButton: {
  backgroundColor: "#F3F4F6",
  padding: 18,
  borderRadius: 30,
  marginBottom: 15,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},

socialText: {
  marginLeft: 10,
  fontSize: 16,
  fontWeight: "600",
},

  createAccountButton: {
    backgroundColor: "#2890b3",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },

  createAccountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f9f6f6",
  },
passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#DDD",
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 15,
  backgroundColor: "#FFF",
},

passwordInput: {
  flex: 1,
  height: 50,
},
  
});