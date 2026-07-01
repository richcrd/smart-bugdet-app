import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronRight, LogOut, Pencil, Trash2, User, X } from "lucide-react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { toast } from "sonner-native";

import { useAuthStore } from "../stores/auth.store";
import { usePreferencesStore } from "../stores/preferences.store";
import { formatCurrency, getErrorMessage } from "@/src/shared/utils/common";
import { useCatalog, useCurrencies } from "../hooks/useCatalog";
import { useCreateWallet, useDeleteWallet, useSetDefaultWallet, useUpdateWallet, useWallets } from "../hooks/useWallets";
import { colors } from "../constants/colors";

type SheetType = "languages" | "wallets" | null;

type MenuRowProps = {
  label: string;
  onPress?: () => void;
  last?: boolean;
};

function MenuRow({ label, onPress, last }: MenuRowProps) {
  return (
    <View>
      <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.6}>
        <Text style={styles.menuLabel}>{label}</Text>
        <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.8} />
      </TouchableOpacity>
      {!last && <View style={styles.separator} />}
    </View>
  );
}

export default function Profile() {
  const logout = useAuthStore((state) => state.logout);
  const languageId = usePreferencesStore((state) => state.languageId);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const [loading, setLoading] = useState(false);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [savingItemId, setSavingItemId] = useState<number | null>(null);
  const { data: languages, isLoading: isLanguageLoading } = useCatalog();
  const { data: currencies } = useCurrencies();
  const { data: wallets, isLoading: isWalletsLoading } = useWallets();

  const [walletMode, setWalletMode] = useState<"list" | "create">("list");
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletCurrencyId, setNewWalletCurrencyId] = useState<number | null>(null);
  const [renamingWalletId, setRenamingWalletId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pendingWalletId, setPendingWalletId] = useState<number | null>(null);

  const createWallet = useCreateWallet();
  const updateWallet = useUpdateWallet();
  const setDefaultWallet = useSetDefaultWallet();
  const deleteWallet = useDeleteWallet();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const openSheet = (type: SheetType) => {
    setSheetType(type);
    bottomSheetRef.current?.expand();
  };

  const closeWalletForm = () => {
    setWalletMode("list");
    setNewWalletName("");
    setNewWalletCurrencyId(null);
  };

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  ), []);

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
          } catch (error) {
            Alert.alert("Error", getErrorMessage(error));
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const confirmSetLanguage = useCallback((item: any) => {
    const label = `${item.name} (${item.code})`;
    Alert.alert("Cambiar idioma", `¿Deseas establecer "${label}" como tu idioma predeterminado?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          setSavingItemId(item.id);
          try {
            await setLanguage(item.id);
            toast.success("Idioma actualizado");
            bottomSheetRef.current?.close();
          } catch (error) {
            toast.error(getErrorMessage(error));
          } finally {
            setSavingItemId(null);
          }
        },
      },
    ]);
  }, [setLanguage]);

  const renderLanguageItem = useCallback(({ item }: { item: any }) => {
    const isDefault = item.id === languageId;
    const isSaving = savingItemId === item.id;
    return (
      <TouchableOpacity
        style={[styles.sheetItem, isDefault && styles.sheetItemActive]}
        onPress={() => confirmSetLanguage(item)}
        disabled={isSaving}
        activeOpacity={0.6}
      >
        <Text style={[styles.sheetItemText, isDefault && styles.sheetItemTextActive]}>
          {item.name} ({item.code})
        </Text>
        {isSaving ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          isDefault && <Check size={18} color={colors.primary} strokeWidth={2} />
        )}
      </TouchableOpacity>
    );
  }, [languageId, savingItemId, confirmSetLanguage]);

  const confirmSetDefaultWallet = useCallback((wallet: any) => {
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
  }, [setDefaultWallet]);

  const handleDeleteWallet = useCallback((wallet: any) => {
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
  }, [deleteWallet]);

  const startRenameWallet = useCallback((wallet: any) => {
    setRenamingWalletId(wallet.id);
    setRenameValue(wallet.name);
  }, []);

  const saveRenameWallet = useCallback(async (walletId: number) => {
    const name = renameValue.trim();
    if (!name) {
      return;
    }
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
  }, [renameValue, updateWallet]);

  const handleCreateWallet = useCallback(async () => {
    const name = newWalletName.trim();
    if (!name || !newWalletCurrencyId) {
      return;
    }
    try {
      await createWallet.mutateAsync({ name, currencyId: newWalletCurrencyId });
      toast.success("Cartera creada");
      closeWalletForm();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [newWalletName, newWalletCurrencyId, createWallet]);

  const renderWalletItem = useCallback(({ item }: { item: any }) => {
    const isPending = pendingWalletId === item.id;
    const isRenaming = renamingWalletId === item.id;

    if (isRenaming) {
      return (
        <View style={[styles.sheetItem, styles.sheetItemRenaming]}>
          <TextInput
            style={styles.renameInput}
            value={renameValue}
            onChangeText={setRenameValue}
            autoFocus
            maxLength={100}
          />
          <TouchableOpacity onPress={() => saveRenameWallet(item.id)} disabled={isPending} style={styles.iconButton}>
            {isPending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Check size={18} color={colors.primary} strokeWidth={2} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRenamingWalletId(null)} style={styles.iconButton}>
            <X size={18} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.sheetItem, item.isDefault && styles.sheetItemActive]}
        onPress={() => !item.isDefault && confirmSetDefaultWallet(item)}
        disabled={isPending}
        activeOpacity={0.6}
      >
        <View style={styles.walletInfo}>
          <Text style={[styles.sheetItemText, item.isDefault && styles.sheetItemTextActive]}>
            {item.name}
          </Text>
          <Text style={styles.walletBalance}>
            {formatCurrency(item.currentBalance, item.currencySymbol)} · {item.currencyCode}
          </Text>
        </View>
        {isPending ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={styles.walletActions}>
            <TouchableOpacity onPress={() => startRenameWallet(item)} style={styles.iconButton}>
              <Pencil size={16} color={colors.textTertiary} strokeWidth={1.8} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteWallet(item)} style={styles.iconButton}>
              <Trash2 size={16} color={colors.danger} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [pendingWalletId, renamingWalletId, renameValue, confirmSetDefaultWallet, handleDeleteWallet, startRenameWallet, saveRenameWallet]);

  if (isLanguageLoading || isWalletsLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.pageTitle}>Perfil</Text>

      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <User size={28} color={colors.primary} strokeWidth={1.8} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Mi cuenta</Text>
          <Text style={styles.userEmail}>Gestiona tu perfil y preferencias</Text>
        </View>
      </View>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionLabel}>Cuenta</Text>
        <View style={styles.menuCard}>
          <MenuRow label="Información personal" last />
        </View>
      </View>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionLabel}>Preferencias</Text>
        <View style={styles.menuCard}>
          <MenuRow label="Métodos de pago" />
          <MenuRow label="Categorías" />
          <MenuRow label="Notificaciones" />
          <MenuRow label="Idiomas" onPress={() => openSheet("languages")} />
          <MenuRow label="Carteras" onPress={() => openSheet("wallets")} last />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} disabled={loading} activeOpacity={0.7}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.danger} />
        ) : (
          <>
            <View style={{ marginRight: 8 }}>
              <LogOut size={18} color={colors.danger} strokeWidth={1.8} />
            </View>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </>
        )}
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["60%"]}
        enablePanDownToClose={true}
        onClose={() => {
          setSheetType(null);
          setRenamingWalletId(null);
          closeWalletForm();
        }}
        backdropComponent={renderBackdrop}
      >
        {sheetType === "wallets" && walletMode === "create" ? (
          <BottomSheetScrollView contentContainerStyle={styles.createForm}>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>Nueva cartera</Text>
              <TouchableOpacity onPress={closeWalletForm} style={styles.iconButton}>
                <X size={20} color={colors.textTertiary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Nombre</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. Ahorros en dólares"
              placeholderTextColor={colors.textTertiary}
              value={newWalletName}
              onChangeText={setNewWalletName}
              maxLength={100}
            />

            <Text style={styles.fieldLabel}>Moneda</Text>
            <View style={styles.currencyPillRow}>
              {(currencies ?? []).map((currency: any) => {
                const selected = currency.id === newWalletCurrencyId;
                return (
                  <TouchableOpacity
                    key={currency.id}
                    style={[styles.currencyPill, selected && styles.currencyPillActive]}
                    onPress={() => setNewWalletCurrencyId(currency.id)}
                  >
                    <Text style={[styles.currencyPillText, selected && styles.currencyPillTextActive]}>
                      {currency.symbol} {currency.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.createButton, (!newWalletName.trim() || !newWalletCurrencyId) && styles.createButtonDisabled]}
              onPress={handleCreateWallet}
              disabled={!newWalletName.trim() || !newWalletCurrencyId || createWallet.isPending}
            >
              {createWallet.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Crear cartera</Text>
              )}
            </TouchableOpacity>
          </BottomSheetScrollView>
        ) : sheetType === "wallets" ? (
          <>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>Carteras</Text>
              <TouchableOpacity onPress={() => setWalletMode("create")} style={[styles.iconButton, { marginRight: 20 }]}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>Agregar</Text>
              </TouchableOpacity>
            </View>
            <BottomSheetFlatList
              data={wallets ?? []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderWalletItem}
              contentContainerStyle={styles.sheetList}
              ListEmptyComponent={
                <Text style={styles.sheetEmpty}>No se encontraron carteras</Text>
              }
            />
          </>
        ) : (
          <>
            <Text style={styles.sheetTitle}>Idiomas</Text>
            <BottomSheetFlatList
              data={languages ?? []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderLanguageItem}
              contentContainerStyle={styles.sheetList}
              ListEmptyComponent={
                <Text style={styles.sheetEmpty}>No se encontraron idiomas</Text>
              }
            />
          </>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 8,
    marginBottom: 24,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionGroup: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  menuLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: 18,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    marginLeft: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.danger,
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
    letterSpacing: 0.5,
    textTransform: "uppercase",
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
