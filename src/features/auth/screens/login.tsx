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
import { useAuthStore } from "@/src/features/auth/stores/auth.store";
import { getApiError } from "@/src/shared/utils/common";
import { styles } from "@/src/features/auth/styles/loginStyles";
import { toast } from "sonner-native";

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
      const { message } = await login({ emailOrPhone: email, password });
      toast.success(message);
      router.replace("/(tabs)");
    } catch (error) {
      const apiError = getApiError(error);
      toast.error(apiError.message);
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

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
            <Text style={styles.loginButtonText}>Continuar</Text>
          )}
        </TouchableOpacity>

        {/* Botón Crear Cuenta */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push("/registro")}
        >
          <Text style={styles.createAccountText}>Crear nueva cuenta</Text>
        </TouchableOpacity>
        {/* utilice styles separatorText */}
        <Text style={styles.separatorText}>
          Al presionar Continuar, aceptas nuestros{"\n"}
          Términos y Condiciones y Política de Privacidad.
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
