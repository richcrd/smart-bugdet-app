import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Eye, EyeOff } from "lucide-react-native";
import { toast } from "sonner-native";
import { colors } from "../../../shared/constants/colors";
import { useChangePassword } from "../../profile/hooks/useUserProfile";
import { getApiError } from "@/src/shared/utils/common";

type Props = {
  onClose?: () => void;
};

export function ChangePasswordSheetContent({ onClose }: Props) {
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSave = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error("Ambos campos son requeridos");
      return;
    }
    if (newPassword.trim().length < 12) {
      toast.error("La nueva contraseña debe tener al menos 12 caracteres");
      return;
    }
    try {
      const result = await changePassword.mutateAsync({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });
      toast.success(result.message);
      setCurrentPassword("");
      setNewPassword("");
      onClose?.();
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  };

  return (
    <BottomSheetScrollView contentContainerStyle={localStyles.form}>
      <Text style={[localStyles.title, { paddingHorizontal: 0 }]}>Cambiar Contraseña</Text>

      <Text style={localStyles.fieldLabel}>Contraseña actual</Text>
      <View>
        <BottomSheetTextInput
          style={localStyles.textInput}
          placeholder="Contraseña actual"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={!showCurrent}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          maxLength={100}
        />
        <TouchableOpacity style={localStyles.toggle} onPress={() => setShowCurrent((v) => !v)}>
          {showCurrent ? <EyeOff size={20} color={colors.textTertiary} strokeWidth={1.8} /> : <Eye size={20} color={colors.textTertiary} strokeWidth={1.8} />}
        </TouchableOpacity>
      </View>

      <Text style={localStyles.fieldLabel}>Nueva contraseña</Text>
      <View>
        <BottomSheetTextInput
          style={localStyles.textInput}
          placeholder="Nueva contraseña"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={!showNew}
          value={newPassword}
          onChangeText={setNewPassword}
          maxLength={100}
        />
        <TouchableOpacity style={localStyles.toggle} onPress={() => setShowNew((v) => !v)}>
          {showNew ? <EyeOff size={20} color={colors.textTertiary} strokeWidth={1.8} /> : <Eye size={20} color={colors.textTertiary} strokeWidth={1.8} />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[localStyles.saveBtn, (!currentPassword.trim() || !newPassword.trim()) && localStyles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!currentPassword.trim() || !newPassword.trim() || changePassword.isPending}
      >
        {changePassword.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={localStyles.saveBtnText}>Guardar cambios</Text>
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
    paddingRight: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggle: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    padding: 4,
  },
  saveBtn: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
