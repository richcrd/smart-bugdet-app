import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";


import { styles } from "../styles/registerStyles";
import { useRegister } from "../hooks/useRegistre";
import { router } from "expo-router";
import { getErrorMessage } from "@/src/shared/utils/common";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Registro() {
  // Datos de People
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Datos de Users
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Estado para manejar el DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Seguridad
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const registerMutation = useRegister();
  const handleRegister = async () => {
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const registerData = {
      firstName,
      lastName,
      birthDate,
      userName,
      email,
      phoneNumber,
      password,
    };
      
    try {
          const { message, response, code } = await registerMutation.mutateAsync(registerData);
          // console.log('API => ' + JSON.stringify(response, null, 2), "MSG " + message, "CODE" + code);
          Alert.alert("Éxito", message, [
            { text: "OK", onPress: () => router.replace("/login") },
          ]);
        } catch (error) {
          Alert.alert("Error", getErrorMessage(error));
        }

   
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <ScrollView contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        Crear Cuenta
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />

      <TouchableOpacity
  style={styles.dateContainer}
  onPress={() => setShowDatePicker(true)}
>
  <Text style={styles.dateText}>
    {birthDate || "Seleccione fecha de nacimiento"}
  </Text>

  <Ionicons
    name="calendar-outline"
    size={22}
    color="#34a545"
  style={{ marginLeft: "auto" }}  
  />
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="default"
    maximumDate={new Date()}
    onChange={(event, date) => {
      setShowDatePicker(false);

      if (date) {
        setSelectedDate(date);

        const formattedDate =
          `${date.getFullYear()}-${
            String(date.getMonth() + 1).padStart(2, "0")
          }-${
            String(date.getDate()).padStart(2, "0")
          }`;

        setBirthDate(formattedDate);
      }
    }}
  />
)}

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={userName}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.registerButtonText}>
          Crear Cuenta
        </Text>
      </TouchableOpacity>
    </ScrollView>
     </KeyboardAvoidingView>
  );
}