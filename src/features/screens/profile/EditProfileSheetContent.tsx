import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { toast } from "sonner-native";
import { colors } from "../../constants/colors";
import { DatePickerSheet } from "@/src/shared/components/DatePickerSheet";
import { useUpdateProfile, useUserProfile } from "../../hooks/useUserProfile";
import { getApiError } from "@/src/shared/utils/common";

type Mode = "form" | "date";

type Props = {
  onClose?: () => void;
  onSnapChange?: (snaps: string[]) => void;
};

export function EditProfileSheetContent({ onClose, onSnapChange }: Props) {
  const { data: profile } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const [mode, setMode] = useState<Mode>("form");
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [birthDate, setBirthDate] = useState(profile?.birthDate ?? "");
  const [userName, setUserName] = useState(profile?.userName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");

  const handleSave = async () => {
    const body: Record<string, string> = {};
    if (firstName.trim()) body.firstName = firstName.trim();
    if (lastName.trim()) body.lastName = lastName.trim();
    if (userName.trim()) body.userName = userName.trim();
    if (email.trim()) body.email = email.trim();
    if (phoneNumber.trim()) body.phoneNumber = phoneNumber.trim();
    if (birthDate.trim()) body.birthDate = birthDate.trim();

    try {
      await updateProfile.mutateAsync(body);
      toast.success("Perfil actualizado");
      onClose?.();
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    setBirthDate(`${year}-${month}-${day}`);
    setMode("form");
  };

  if (mode === "date") {
    return (
      <DatePickerSheet
        value={birthDate ? new Date(birthDate + "T12:00:00") : new Date()}
        onChange={handleDateChange}
        onDone={() => setMode("form")}
        title="Fecha de Nacimiento"
        maximumDate={new Date()}
      />
    );
  }

  return (
    <BottomSheetScrollView contentContainerStyle={localStyles.form}>
      <Text style={[localStyles.title, { paddingHorizontal: 0 }]}>Editar Perfil</Text>

      <Text style={localStyles.fieldLabel}>Nombre</Text>
      <BottomSheetTextInput
        style={localStyles.textInput}
        placeholder="Nombre"
        placeholderTextColor={colors.textTertiary}
        value={firstName}
        onChangeText={setFirstName}
        maxLength={30}
      />

      <Text style={localStyles.fieldLabel}>Apellido</Text>
      <BottomSheetTextInput
        style={localStyles.textInput}
        placeholder="Apellido"
        placeholderTextColor={colors.textTertiary}
        value={lastName}
        onChangeText={setLastName}
        maxLength={30}
      />

      <Text style={localStyles.fieldLabel}>Fecha de Nacimiento</Text>
      <TouchableOpacity style={localStyles.textInput} onPress={() => setMode("date")}>
        <Text style={{ fontSize: 15, color: birthDate ? colors.textPrimary : colors.textTertiary }}>
          {birthDate || "Seleccionar Fecha"}
        </Text>
      </TouchableOpacity>

      <Text style={localStyles.fieldLabel}>Nombre de Usuario</Text>
      <BottomSheetTextInput
        style={localStyles.textInput}
        placeholder="Usuario"
        placeholderTextColor={colors.textTertiary}
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
        maxLength={50}
      />

      <Text style={localStyles.fieldLabel}>Teléfono</Text>
      <BottomSheetTextInput
        style={localStyles.textInput}
        placeholder="Número de teléfono"
        placeholderTextColor={colors.textTertiary}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={30}
      />

      <Text style={localStyles.fieldLabel}>Correo Electrónico</Text>
      <BottomSheetTextInput
        style={localStyles.textInput}
        placeholder="correo@ejemplo.com"
        placeholderTextColor={colors.textTertiary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={150}
      />

      <TouchableOpacity
        style={localStyles.saveBtn}
        onPress={handleSave}
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={localStyles.saveBtnText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>
    </BottomSheetScrollView>
  );
}

const localStyles = StyleSheet.create({
  form: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingTop: 4,
    paddingBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBtn: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
