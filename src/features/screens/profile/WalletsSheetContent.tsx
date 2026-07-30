import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheetFlatList, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Check, Pencil, Trash2, X } from "lucide-react-native";
import { toast } from "sonner-native";
import { colors } from "../../constants/colors";
import { formatCurrency, getErrorMessage } from "@/src/shared/utils/common";
import { useCurrencies } from "../../hooks/useCatalog";
import { useCreateWallet, useDeleteWallet, useSetDefaultWallet, useUpdateWallet, useWallets } from "../../hooks/useWallets";

type Mode = "list" | "create";

type Props = {
  onSnapChange?: (snaps: string[]) => void;
};

export function WalletsSheetContent({ onSnapChange }: Props) {
  const { data: wallets, isLoading } = useWallets();
  const { data: currencies } = useCurrencies();
  const createWallet = useCreateWallet();
  const updateWallet = useUpdateWallet();
  const setDefaultWallet = useSetDefaultWallet();
  const deleteWallet = useDeleteWallet();

  const [mode, setMode] = useState<Mode>("list");
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletCurrencyId, setNewWalletCurrencyId] = useState<number | null>(null);
  const [renamingWalletId, setRenamingWalletId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pendingWalletId, setPendingWalletId] = useState<number | null>(null);

  useEffect(() => {
    if (!onSnapChange || !wallets) return;
    onSnapChange(wallets.length < 3 ? ["35%"] : ["75%"]);
  }, [wallets, onSnapChange]);

  useEffect(() => {
    if (mode !== "list") {
      onSnapChange?.(["75%"]);
    } else if (wallets) {
      onSnapChange?.(wallets.length < 3 ? ["35%"] : ["75%"]);
    }
  }, [mode, wallets, onSnapChange]);

  const closeWalletForm = () => {
    setMode("list");
    setNewWalletName("");
    setNewWalletCurrencyId(null);
  };

  const confirmSetDefaultWallet = (wallet: any) => {
    Alert.alert("Cambiar cartera predeterminada", `¿Deseas usar "${wallet.name}" como tu cartera predeterminada?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          setPendingWalletId(wallet.id);
          try {
            await setDefaultWallet.mutateAsync(wallet.id);
            toast.success("Cartera predeterminada actualizada");
          } catch (error) {
            toast.error(getErrorMessage(error));
          } finally {
            setPendingWalletId(null);
          }
        },
      },
    ]);
  };

  const handleDeleteWallet = (wallet: any) => {
    Alert.alert("Eliminar cartera", `¿Deseas eliminar "${wallet.name}"? Esta acción no se puede deshacer.`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setPendingWalletId(wallet.id);
          try {
            await deleteWallet.mutateAsync(wallet.id);
            toast.success("Cartera eliminada");
          } catch (error) {
            toast.error(getErrorMessage(error));
          } finally {
            setPendingWalletId(null);
          }
        },
      },
    ]);
  };

  const startRenameWallet = (wallet: any) => {
    setRenamingWalletId(wallet.id);
    setRenameValue(wallet.name);
  };

  const saveRenameWallet = async (walletId: number) => {
    const name = renameValue.trim();
    if (!name) return;
    setPendingWalletId(walletId);
    try {
      await updateWallet.mutateAsync({ id: walletId, body: { name } });
      toast.success("Cartera actualizada");
      setRenamingWalletId(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPendingWalletId(null);
    }
  };

  const handleCreateWallet = async () => {
    const name = newWalletName.trim();
    if (!name || !newWalletCurrencyId) return;
    try {
      await createWallet.mutateAsync({ name, currencyId: newWalletCurrencyId });
      toast.success("Cartera creada");
      closeWalletForm();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <View style={localStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (mode === "create") {
    return (
      <BottomSheetScrollView contentContainerStyle={localStyles.createForm}>
        <View style={localStyles.sheetHeaderRow}>
          <Text style={[localStyles.sheetTitle, { paddingHorizontal: 0 }]}>Nueva cartera</Text>
          <TouchableOpacity onPress={closeWalletForm} style={localStyles.iconButton}>
            <X size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Text style={localStyles.fieldLabel}>Nombre</Text>
        <BottomSheetTextInput
          style={localStyles.textInput}
          placeholder="Ej. Ahorros en dólares"
          placeholderTextColor={colors.textTertiary}
          value={newWalletName}
          onChangeText={setNewWalletName}
          maxLength={100}
        />

        <Text style={localStyles.fieldLabel}>Moneda</Text>
        <View style={localStyles.currencyPillRow}>
          {(currencies ?? []).map((currency: any) => {
            const selected = currency.id === newWalletCurrencyId;
            return (
              <TouchableOpacity
                key={currency.id}
                style={[localStyles.currencyPill, selected && localStyles.currencyPillActive]}
                onPress={() => setNewWalletCurrencyId(currency.id)}
              >
                <Text style={[localStyles.currencyPillText, selected && localStyles.currencyPillTextActive]}>
                  {currency.symbol} {currency.code}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[localStyles.createButton, (!newWalletName.trim() || !newWalletCurrencyId) && localStyles.createButtonDisabled]}
          onPress={handleCreateWallet}
          disabled={!newWalletName.trim() || !newWalletCurrencyId || createWallet.isPending}
        >
          {createWallet.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={localStyles.createButtonText}>Crear cartera</Text>
          )}
        </TouchableOpacity>
      </BottomSheetScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={localStyles.sheetHeaderRow}>
        <Text style={localStyles.sheetTitle}>Carteras</Text>
        <TouchableOpacity
          onPress={() => { setMode("create"); setNewWalletName(""); setNewWalletCurrencyId(null); }}
          style={[localStyles.iconButton, { marginRight: 20 }]}
        >
          <Text style={{ color: colors.primary, fontSize: 16 }}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <BottomSheetFlatList
        data={wallets ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isPending = pendingWalletId === item.id;
          const isRenaming = renamingWalletId === item.id;

          if (isRenaming) {
            return (
              <View style={[localStyles.sheetItem, localStyles.sheetItemRenaming]}>
                <BottomSheetTextInput
                  style={localStyles.renameInput}
                  value={renameValue}
                  onChangeText={setRenameValue}
                  autoFocus
                  maxLength={100}
                />
                <TouchableOpacity onPress={() => saveRenameWallet(item.id)} disabled={isPending} style={localStyles.iconButton}>
                  {isPending ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Check size={18} color={colors.primary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRenamingWalletId(null)} style={localStyles.iconButton}>
                  <X size={18} color={colors.textTertiary} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              style={[localStyles.sheetItem, item.isDefault && localStyles.sheetItemActive]}
              onPress={() => !item.isDefault && confirmSetDefaultWallet(item)}
              disabled={isPending}
              activeOpacity={0.6}
            >
              <View style={localStyles.walletInfo}>
                <Text style={[localStyles.sheetItemText, item.isDefault && localStyles.sheetItemTextActive]}>
                  {item.name}
                </Text>
                <Text style={localStyles.walletBalance}>
                  {formatCurrency(item.currentBalance, item.currencySymbol)} · {item.currencyCode}
                </Text>
              </View>
              {isPending ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={localStyles.walletActions}>
                  <TouchableOpacity onPress={() => startRenameWallet(item)} style={localStyles.iconButton}>
                    <Pencil size={16} color={colors.textTertiary} strokeWidth={1.8} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteWallet(item)} style={localStyles.iconButton}>
                    <Trash2 size={16} color={colors.danger} strokeWidth={1.8} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={localStyles.sheetList}
        ListEmptyComponent={
          <Text style={localStyles.sheetEmpty}>No se encontraron carteras</Text>
        }
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 12,
  },
  sheetList: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sheetItemRenaming: {
    gap: 8,
  },
  sheetItemActive: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
  },
  sheetItemText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  sheetItemTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  sheetEmpty: {
    textAlign: "center",
    marginTop: 24,
    color: colors.textSecondary,
    fontSize: 14,
  },
  walletInfo: {
    flex: 1,
  },
  walletBalance: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  walletActions: {
    flexDirection: "row",
    gap: 4,
  },
  iconButton: {
    padding: 6,
  },
  renameInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  createForm: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  currencyPillRow: {
    flexDirection: "row",
    gap: 10,
  },
  currencyPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currencyPillText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  currencyPillTextActive: {
    color: "#fff",
  },
  createButton: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
