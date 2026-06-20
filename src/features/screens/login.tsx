import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { styles } from "../styles/loginStyles";

export default function Login() {
  // Estado para guardar el correo o teléfono
  const [email, setEmail] = useState("");

  // Estado para guardar la contraseña
  const [password, setPassword] = useState("");

  // Función para el botón Continuar
  const handleLogin = () => {
    console.log("Usuario:", email);
    console.log("Contraseña:", password);

    
  };

  return (
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
      />

      {/* Campo Contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>
          Continuar
        </Text>
      </TouchableOpacity>

      
      <Text style={styles.separatorText}>
        También puedes iniciar sesión con:
      </Text>

      
<TouchableOpacity style={styles.socialButton}>
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
</TouchableOpacity>

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
  );
}