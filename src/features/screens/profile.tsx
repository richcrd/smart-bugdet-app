import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronRight, Eye, EyeOff, LogOut, Pencil, Trash2, X } from "lucide-react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetFlatList, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { toast } from "sonner-native";

import Constants from "expo-constants";
import { useAuthStore } from "../stores/auth.store";
import { usePreferencesStore } from "../stores/preferences.store";
import { formatCurrency, getApiError, getErrorMessage } from "@/src/shared/utils/common";
import { useCatalog, useCurrencies } from "../hooks/useCatalog";
import { useCreateWallet, useDeleteWallet, useSetDefaultWallet, useUpdateWallet, useWallets } from "../hooks/useWallets";
import { registerForPushNotifications } from "../notifications/register";
import { colors } from "../constants/colors";
import { useChangePassword, useUpdateProfile, useUserProfile } from "../hooks/useUserProfile";
import { DatePickerSheet } from "@/src/shared/components/DatePickerSheet";
import { CategorySheetContent } from "./profile/CategorySheetContent";
import { PaymentMethodSheetContent } from "./profile/PaymentMethodSheetContent";

type SheetType = "languages" | "wallets" | "balanceAlert" | "editProfile" | "categories" | "paymentMethods" | "changePassword" | null;

type MenuRowProps = {
  label: string;
  onPress?: () => void;
  last?: boolean;
  loading?: boolean;
};

function MenuRow({ label, onPress, last, loading }: MenuRowProps) {
  return (
    <View>
      <TouchableOpacity style={styles.menuRow} onPress={onPress} disabled={loading} activeOpacity={0.6}>
        <Text style={styles.menuLabel}>{label}</Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.8} />
        )}
      </TouchableOpacity>
      {!last && <View style={styles.separator} />}
    </View>
  );
}

type MenuSwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  last?: boolean;
};

type MenuInfoRowProps = {
  label: string;
  info: string;
  last?: boolean;
};

function MenuInfoRow({ label, info, last }: MenuInfoRowProps) {
  return (
    <View>
      <View style={styles.menuRow}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuInfo}>{info}</Text>
      </View>
      {!last && <View style={styles.separator} />}
    </View>
  );
}

function MenuSwitchRow({ label, value, onValueChange, disabled, last }: MenuSwitchRowProps) {
  return (
    <View>
      <View style={styles.menuRow}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: colors.border, true: colors.primary }}
        />
      </View>
      {!last && <View style={styles.separator} />}
    </View>
  );
}

export default function Profile() {
  const logout = useAuthStore((state) => state.logout);
  const languageId = usePreferencesStore((state) => state.languageId);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const notificationsEnabled = usePreferencesStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = usePreferencesStore((state) => state.setNotificationsEnabled);
  const balanceAlertThreshold = usePreferencesStore((state) => state.balanceAlertThreshold);
  const setBalanceAlertThreshold = usePreferencesStore((state) => state.setBalanceAlertThreshold);
  const [loading, setLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [savingItemId, setSavingItemId] = useState<number | null>(null);
  const [balanceAlertInput, setBalanceAlertInput] = useState("");
  const [savingBalanceAlert, setSavingBalanceAlert] = useState(false);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const changePassword = useChangePassword();
  const { data: languages, isLoading: isLanguageLoading } = useCatalog();
  const { data: currencies } = useCurrencies();
  const { data: wallets, isLoading: isWalletsLoading } = useWallets();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();

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
  const updateProfile = useUpdateProfile();
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editBirthDate, setEditBirthDate] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPage, setEditPage] = useState<"form" | "date">("form");

  const [sheetSnapPoints, setSheetSnapPoints] = useState(["75%"]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!sheetType) return;
    if (sheetType === "languages" && languages) {
      setSheetSnapPoints(languages.length < 3 ? ["35%"] : ["75%"]);
    }
    if (sheetType === "wallets" && wallets) {
      setSheetSnapPoints(wallets.length < 3 ? ["35%"] : ["75%"]);
    }
  }, [sheetType, languages, wallets]);

  const openSheet = (type: SheetType) => {
    if (type === "balanceAlert") {
      setBalanceAlertInput(balanceAlertThreshold?.toString() ?? "");
    }
    if (type === "editProfile" && profile) {
      setEditPage("form");
      setEditFirstName(profile.firstName ?? "");
      setEditLastName(profile.lastName ?? "");
      setEditBirthDate(profile.birthDate ?? "");
      setEditUserName(profile.userName ?? "");
      setEditPhoneNumber(profile.phoneNumber ?? "");
      setEditEmail(profile.email ?? "");
    }
    setSheetType(type);
    bottomSheetRef.current?.present();
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

  const handleToggleNotifications = useCallback(async (nextValue: boolean) => {
    setNotificationsLoading(true);
    try {
      if (nextValue) {
        await registerForPushNotifications();
      }
      await setNotificationsEnabled(nextValue);
      toast.success(nextValue ? "Notificaciones activadas" : "Notificaciones desactivadas");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setNotificationsLoading(false);
    }
  }, [setNotificationsEnabled]);

  const handleSaveBalanceAlert = useCallback(async () => {
    const threshold = parseFloat(balanceAlertInput);
    if (isNaN(threshold) || threshold < 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    setSavingBalanceAlert(true);
    try {
      await setBalanceAlertThreshold(threshold);
      toast.success("Alerta de saldo actualizada");
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingBalanceAlert(false);
    }
  }, [balanceAlertInput, setBalanceAlertThreshold]);

  const handleChangePassword = useCallback(async () => {
    if (!passwordCurrent.trim() || !passwordNew.trim()) {
      toast.error("Ambos campos son requeridos");
      return;
    }
    if (passwordNew.trim().length < 12) {
      toast.error("La nueva contraseña debe tener al menos 12 caracteres");
      return;
    }
    try {
      const result = await changePassword.mutateAsync({
        currentPassword: passwordCurrent.trim(), 
        newPassword: passwordNew.trim()
      });
      toast.success(result.message);
      setPasswordCurrent("");
      setPasswordNew("");
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  }, [passwordCurrent, passwordNew, changePassword]);

  const handleSaveProfile = useCallback(async () => {
    const body: Record<string, string> = {};
    if (editFirstName.trim()) body.firstName = editFirstName.trim();
    if (editLastName.trim()) body.lastName = editLastName.trim();
    if (editUserName.trim()) body.userName = editUserName.trim();
    if (editEmail.trim()) body.email = editEmail.trim();
    if (editPhoneNumber.trim()) body.phoneNumber = editPhoneNumber.trim();
    if (editBirthDate.trim()) body.birthDate = editBirthDate.trim();

    try {
      await updateProfile.mutateAsync(body);
      toast.success("Perfil actualizado");
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      const apiError = getApiError(error);
      toast.error(apiError.message);
    }
  }, [editFirstName, editLastName, editBirthDate, editUserName, editPhoneNumber, editEmail, updateProfile]);

  const handleDateChange = useCallback((selectedDate: Date) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0")
    setEditBirthDate(`${year}-${month}-${day}`);
    setEditPage("form");
  }, []);

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
            bottomSheetRef.current?.dismiss();
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
          <BottomSheetTextInput
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

  if (isLanguageLoading || isWalletsLoading || isProfileLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <Text style={styles.pageTitle}>Perfil</Text>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionLabel}>Cuenta</Text>
        <View style={styles.menuCard}>
          <MenuRow label="Editar Perfil" onPress={() => openSheet("editProfile")} last />
        </View>
      </View>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionLabel}>Preferencias</Text>
        <View style={styles.menuCard}>
          <MenuRow label="Métodos de pago" onPress={() => openSheet("paymentMethods")} />
          <MenuRow label="Categorías" onPress={() => openSheet("categories")} />
          <MenuSwitchRow
            label="Notificaciones"
            value={notificationsEnabled ?? false}
            onValueChange={handleToggleNotifications}
            disabled={notificationsLoading}
          />
          <MenuRow label="Alerta de saldo" onPress={() => openSheet("balanceAlert")} />
          <MenuRow label="Idiomas" onPress={() => openSheet("languages")} />
          <MenuRow label="Carteras" onPress={() => openSheet("wallets")} last />
        </View>
      </View>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionLabel}>Seguridad</Text>
        <View style={styles.menuCard}>
          <MenuRow label="Cambiar Contraseña" onPress={() => openSheet("changePassword")} last />
        </View>
      </View>

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionLabel}>Soporte</Text>
        <View style={styles.menuCard}>
          <MenuRow label="Contactar Soporte" onPress={() => Linking.openURL("mailto:richardrrc1204@gmail.com")} />
          <MenuInfoRow label="Versión" info={`v${Constants.expoConfig?.version ?? "1.0.0"}`} last />
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
      </ScrollView>

        <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={sheetSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        onDismiss={() => {
          setSheetSnapPoints(["75%"]);
          setRenamingWalletId(null);
          closeWalletForm();
          setPasswordCurrent("");
          setPasswordNew("");
        }}
        backdropComponent={renderBackdrop}
      >
        {sheetType === "wallets" && walletMode === "create" ? (
          <BottomSheetScrollView contentContainerStyle={styles.createForm}>
            <View style={styles.sheetHeaderRow}>
              <Text style={[styles.sheetTitle, { paddingHorizontal: 0 }]}>Nueva cartera</Text>
              <TouchableOpacity onPress={closeWalletForm} style={styles.iconButton}>
                <X size={20} color={colors.textTertiary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Nombre</Text>
            <BottomSheetTextInput
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
        ) : sheetType === "balanceAlert" ? (
          <BottomSheetScrollView contentContainerStyle={styles.createForm}>
            <Text style={[styles.sheetTitle, { paddingHorizontal: 0 }]}>Alerta de saldo</Text>
            <Text style={styles.fieldLabel}>Notificarme cuando mi saldo llegue a</Text>
            <BottomSheetTextInput
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              value={balanceAlertInput}
              onChangeText={setBalanceAlertInput}
            />
            <TouchableOpacity
              style={[styles.createButton, !balanceAlertInput.trim() && styles.createButtonDisabled]}
              onPress={handleSaveBalanceAlert}
              disabled={!balanceAlertInput.trim() || savingBalanceAlert}
            >
              {savingBalanceAlert ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </BottomSheetScrollView>
        ) : sheetType === "editProfile" && editPage === "form" ? (
          <BottomSheetScrollView contentContainerStyle={styles.createForm}>
            <Text style={[styles.sheetTitle, { paddingHorizontal: 0 }]}>Editar Perfil</Text>
                
            <Text style={styles.fieldLabel}>Nombre</Text>
            <BottomSheetTextInput
              style={styles.textInput}
              placeholder="Nombre"
              placeholderTextColor={colors.textTertiary}
              value={editFirstName}
              onChangeText={setEditFirstName}
              maxLength={30}
            />

            <Text style={styles.fieldLabel}>Apellido</Text>
            <BottomSheetTextInput
              style={styles.textInput}
              placeholder="Apellido"
              placeholderTextColor={colors.textTertiary}
              value={editLastName}
              onChangeText={setEditLastName}
              maxLength={30}
            />

            <Text style={styles.fieldLabel}>Fecha de Nacimiento</Text>
            <TouchableOpacity style={styles.textInput} onPress={() => setEditPage("date")}>
              <Text style={{ fontSize: 15, color: editBirthDate ? colors.textPrimary : colors.textTertiary }}>{editBirthDate || "Seleccionar Fecha"}</Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Nombre de Usuario</Text>
            <BottomSheetTextInput
              style={styles.textInput}
              placeholder="Usuario"
              placeholderTextColor={colors.textTertiary}
              value={editUserName}
              onChangeText={setEditUserName}
              autoCapitalize="none"
              maxLength={50}
            />

            <Text style={styles.fieldLabel}>Teléfono</Text>
            <BottomSheetTextInput
              style={styles.textInput}
              placeholder="Número de teléfono"
              placeholderTextColor={colors.textTertiary}
              value={editPhoneNumber}
              onChangeText={setEditPhoneNumber}
              keyboardType="phone-pad"
              maxLength={30}
            />

            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
            <BottomSheetTextInput
              style={styles.textInput}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.textTertiary}
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={150}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleSaveProfile}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </BottomSheetScrollView> 
          ) : sheetType === "editProfile" && editPage === "date" ? (
              <DatePickerSheet
                value={editBirthDate ? new Date(editBirthDate + "T12:00:00") : new Date()}
                onChange={handleDateChange}
                onDone={() => setEditPage("form")}
                title="Fecha de Nacimiento"
                maximumDate={new Date()}
              />
          ) : sheetType === "categories" ? (
            <CategorySheetContent onSnapChange={setSheetSnapPoints} />
          ) : sheetType === "paymentMethods" ? (
            <PaymentMethodSheetContent onSnapChange={setSheetSnapPoints} />
          ) : sheetType === "changePassword" ? (
            <BottomSheetScrollView contentContainerStyle={styles.createForm}>
              <Text style={[styles.sheetTitle, { paddingHorizontal: 0 }]}>Cambiar Contraseña</Text>
              <Text style={styles.fieldLabel}>Contraseña actual</Text>
              <View>
                <BottomSheetTextInput
                  style={styles.textInput}
                  placeholder="Contraseña actual"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showCurrentPassword}
                  value={passwordCurrent}
                  onChangeText={setPasswordCurrent}
                  maxLength={100}
                />
                <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowCurrentPassword((v) => !v)}>
                  {showCurrentPassword ? <EyeOff size={20} color={colors.textTertiary} strokeWidth={1.8} /> : <Eye size={20} color={colors.textTertiary} strokeWidth={1.8} />}
                </TouchableOpacity>
              </View>
              <Text style={styles.fieldLabel}>Nueva contraseña</Text>
              <View>
                <BottomSheetTextInput
                  style={styles.textInput}
                  placeholder="Nueva contraseña"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showNewPassword}
                  value={passwordNew}
                  onChangeText={setPasswordNew}
                  maxLength={100}
                />
                <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowNewPassword((v) => !v)}>
                  {showNewPassword ? <EyeOff size={20} color={colors.textTertiary} strokeWidth={1.8} /> : <Eye size={20} color={colors.textTertiary} strokeWidth={1.8} />}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.createButton, (!passwordCurrent.trim() || !passwordNew.trim()) && styles.createButtonDisabled]}
                onPress={handleChangePassword}
                disabled={!passwordCurrent.trim() || !passwordNew.trim() || changePassword.isPending}
              >
                {changePassword.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Guardar cambios</Text>
                )}
              </TouchableOpacity>
            </BottomSheetScrollView>
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
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCard,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  sectionGroup: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
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
  menuInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "400",
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
  passwordToggle: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    padding: 4,
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
