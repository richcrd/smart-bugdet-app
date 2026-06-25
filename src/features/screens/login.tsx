import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/src/features/stores/auth.store";
import { getErrorMessage } from "@/src/shared/utils/common";
import { styles } from "../styles/loginStyles";

export default function Login() {
  // Estado para guardar el correo o teléfono
  const [email, setEmail] = useState("");

  // Estado para guardar la contraseña
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  // Función para el botón Continuar
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const { message, response, code } = await login({ emailOrPhone: email, password });
      // console.log('API => ' + JSON.stringify(response, null, 2), "MSG " + message, "CODE" + code);
      Alert.alert("Éxito", message, [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>
        Inicia sesión con{"\n"}
        tus credenciales
      </Text>

      {/* Campo Correo o Teléfono */}
      <TextInput
        style={styles.input}
        placeholder="Número de Teléfono o Correo"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      {/* Campo Contraseña */}
<View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Contraseña"
    placeholderTextColor="#999"
    secureTextEntry={!showPassword}
    value={password}
    onChangeText={setPassword}
    autoCapitalize="none"
  />

  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
  >
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={24}
      color="#666"
    /> 
  </TouchableOpacity>
</View>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={styles.loginButton}    
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.loginButtonText}>
            Continuar
          </Text>
        )}
      </TouchableOpacity>
      
      {/* Separador 
      <Text style={styles.separatorText}>
        También puedes iniciar sesión con:
      </Text>*/}

      
{/*<TouchableOpacity style={styles.socialButton}>
  <FontAwesome name="google" size={24} color="#DB4437" />

  <Text style={styles.socialText}>
    Iniciar sesión con Google
  </Text>
</TouchableOpacity>


<TouchableOpacity style={styles.socialButton}>
  <FontAwesome name="facebook-square" size={24} color="#1877F2" />

  <Text style={styles.socialText}>
    Iniciar sesión con Facebook
  </Text>
</TouchableOpacity>*/}

{/* Botón Crear Cuenta */}
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => router.push("/registro")}
      >
        <Text style={styles.createAccountText}>
          Crear nueva cuenta
        </Text>
      </TouchableOpacity>
 {/* utilice styles separatorText */}
      <Text style={styles.separatorText}>
        Al precionar "Continuar", aceptas nuestros{"\n"}
        Términos y Condiciones y Política de Privacidad.
      </Text>
      
  
      </View>
       </TouchableWithoutFeedback>
  );
}
