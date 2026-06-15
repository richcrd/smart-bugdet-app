import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { styles } from "../styles/HomeStyles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/smb-logo.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>
        Organiza y controla tus{"\n"}
        gastos y administra tu dinero.
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.loginText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/(public)/registro")}
      >
        <Text style={styles.registerText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
