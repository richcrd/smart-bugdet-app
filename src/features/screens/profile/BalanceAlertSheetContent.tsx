import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { toast } from "sonner-native";
import { colors } from "../../constants/colors";
import { usePreferencesStore } from "../../stores/preferences.store";
import { getErrorMessage } from "@/src/shared/utils/common";

type Props = {
  onClose?: () => void;
  onSnapChange?: (snaps: string[]) => void;
};

export function BalanceAlertSheetContent({ onClose, onSnapChange }: Props) {
  const balanceAlertThreshold = usePreferencesStore((state) => state.balanceAlertThreshold);
  const setBalanceAlertThreshold = usePreferencesStore((state) => state.setBalanceAlertThreshold);

  const [input, setInput] = useState(balanceAlertThreshold?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const threshold = parseFloat(input);
    if (isNaN(threshold) || threshold < 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    setSaving(true);
    try {
      await setBalanceAlertThreshold(threshold);
      toast.success("Alerta de saldo actualizada");
      onClose?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheetScrollView contentContainerStyle={localStyles.form}>
      <Text style={[localStyles.title, { paddingHorizontal: 0 }]}>Alerta de saldo</Text>
      <Text style={localStyles.fieldLabel}>Notificarme cuando mi saldo llegue a</Text>
      <BottomSheetTextInput
        style={localStyles.textInput}
        placeholder="0.00"
        placeholderTextColor={colors.textTertiary}
        keyboardType="decimal-pad"
        value={input}
        onChangeText={setInput}
      />
      <TouchableOpacity
        style={[localStyles.saveBtn, !input.trim() && localStyles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!input.trim() || saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={localStyles.saveBtnText}>Guardar</Text>
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
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
