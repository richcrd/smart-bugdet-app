import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { BottomSheetFlatList, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Pencil, Plus, Trash2, X } from "lucide-react-native";
import { toast } from "sonner-native";
import { colors } from "../../constants/colors";
import {
  useLinkPaymentMethod,
  useSystemPaymentMethods,
  useUnlinkPaymentMethod,
  useUpdatePaymentMethodAlias,
  useUserPaymentMethods,
} from "../../hooks/useUserData";
import type { PaymentMethodResponse } from "../../data/catalog";
import { getApiError } from "@/src/shared/utils/common";

export function PaymentMethodSheetContent({ onSnapChange }: { onSnapChange?: (snap: string[]) => void }) {
  const { data: userMethods, isLoading: loadingUser } = useUserPaymentMethods();
  const { data: systemMethods } = useSystemPaymentMethods();
  const linkMethod = useLinkPaymentMethod();
  const updateAlias = useUpdatePaymentMethodAlias();
  const unlinkMethod = useUnlinkPaymentMethod();

  const [mode, setMode] = useState<"list" | "link" | "edit-alias">("list");
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [aliasInput, setAliasInput] = useState("");

  const calcSnap = useCallback((list: typeof userMethods) => {
    onSnapChange?.((list?.length ?? 0) < 3 ? ["35%"] : ["75%"]);
  }, [onSnapChange]);

  useEffect(() => {
    if (!loadingUser && mode === "list") {
      calcSnap(userMethods);
    }
  }, [loadingUser, mode, userMethods, calcSnap]);

  useEffect(() => {
    if (mode !== "list") {
      onSnapChange?.(["75%"]);
    }
  }, [mode, onSnapChange]);

  const userMethodIds = new Set(userMethods?.map((m) => m.paymentMethodId) ?? []);
  const availableMethods = (systemMethods ?? []).filter((m) => !userMethodIds.has(m.id));

  const handleLink = async (pm: PaymentMethodResponse) => {
    try {
      await linkMethod.mutateAsync({ paymentMethodId: pm.id });
      toast.success(`"${pm.name}" vinculado`);
      setMode("list");
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  };

  const handleUpdateAlias = async () => {
    if (!selectedMethodId) return;
    try {
      await updateAlias.mutateAsync({ id: selectedMethodId, body: { alias: aliasInput.trim() || undefined } });
      toast.success("Alias actualizado");
      setMode("list");
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  };

  const handleUnlink = (id: number, name: string) => {
    Alert.alert("Desvincular", `¿Desvincular "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Desvincular",
        style: "destructive",
        onPress: async () => {
          try {
            await unlinkMethod.mutateAsync(id);
            toast.success("Método de pago desvinculado");
          } catch (error) {
            toast.error(getApiError(error).message);
          }
        },
      },
    ]);
  };

  if (loadingUser) {
    return (
      <View style={localStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (mode === "link") {
    return (
      <View style={{ flex: 1 }}>
        <View style={localStyles.headerRow}>
          <TouchableOpacity onPress={() => setMode("list")}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Atrás</Text>
          </TouchableOpacity>
          <Text style={localStyles.title}>Vincular método</Text>
          <View style={{ width: 40 }} />
        </View>
        <BottomSheetFlatList
          data={availableMethods}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={localStyles.item} onPress={() => handleLink(item)} disabled={linkMethod.isPending} activeOpacity={0.6}>
              <Text style={localStyles.itemName}>{item.name}</Text>
              {linkMethod.isPending ? <ActivityIndicator size="small" color={colors.primary} /> : <Plus size={18} color={colors.primary} strokeWidth={2} />}
            </TouchableOpacity>
          )}
          contentContainerStyle={localStyles.list}
          ListEmptyComponent={<Text style={localStyles.empty}>No hay métodos disponibles</Text>}
        />
      </View>
    );
  }

  if (mode === "edit-alias") {
    return (
      <BottomSheetScrollView contentContainerStyle={localStyles.form}>
        <View style={[localStyles.headerRow, localStyles.headerRowInForm]}>
          <Text style={localStyles.title}>Editar alias</Text>
          <TouchableOpacity onPress={() => setMode("list")}>
            <X size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Text style={localStyles.label}>Alias</Text>
        <BottomSheetTextInput style={localStyles.input} placeholder="Ej. Mi tarjeta de crédito" placeholderTextColor={colors.textTertiary} value={aliasInput} onChangeText={setAliasInput} maxLength={100} />
        <TouchableOpacity style={localStyles.saveBtn} onPress={handleUpdateAlias} disabled={updateAlias.isPending}>
          {updateAlias.isPending ? <ActivityIndicator size="small" color="#fff" /> : <Text style={localStyles.saveBtnText}>Guardar alias</Text>}
        </TouchableOpacity>
      </BottomSheetScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={localStyles.headerRow}>
        <Text style={localStyles.title}>Métodos de pago</Text>
        <TouchableOpacity onPress={() => setMode("link")}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <BottomSheetFlatList
        data={userMethods ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={localStyles.item}>
            <View style={localStyles.itemInfo}>
              <Text style={localStyles.itemName}>{item.alias || item.name}</Text>
              {item.alias && <Text style={localStyles.itemSub}>{item.name}</Text>}
            </View>
            <TouchableOpacity
              style={localStyles.iconBtn}
              onPress={() => {
                setSelectedMethodId(item.id);
                setAliasInput(item.alias ?? "");
                setMode("edit-alias");
              }}
            >
              <Pencil size={16} color={colors.textTertiary} strokeWidth={1.8} />
            </TouchableOpacity>
            <TouchableOpacity style={localStyles.iconBtn} onPress={() => handleUnlink(item.id, item.alias || item.name)}>
              <Trash2 size={16} color={colors.danger} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={localStyles.list}
        ListEmptyComponent={<Text style={localStyles.empty}>Sin métodos vinculados</Text>}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  headerRowInForm: {
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 18, 
    fontWeight: "700",
    color: colors.textPrimary
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 20
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    color: colors.textSecondary,
    fontSize: 14
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 10
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500"
  },
  itemSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  iconBtn: { 
    padding: 6
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 32
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 8
  },
  input: {
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  saveBtn: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center"
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff" 
  },
});