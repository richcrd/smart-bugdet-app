import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronRight, LogOut } from "lucide-react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { toast } from "sonner-native";
import Constants from "expo-constants";
import { useAuthStore } from "@/src/features/auth/stores/auth.store";
import { usePreferencesStore } from "@/src/features/profile/stores/preferences.store";
import { getErrorMessage } from "@/src/shared/utils/common";
import { useCatalog } from "../hooks/useCatalog";
import { registerForPushNotifications } from "@/src/features/notifications/register";
import { colors } from "@/src/shared/constants/colors";
import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { CategoryManagerSheet } from "../components/CategorySheetContent";
import { PaymentMethodManagerSheet } from "../components/PaymentMethodSheetContent";
import { WalletsSheetContent } from "@/src/features/profile/components/WalletsSheetContent";
import { BalanceAlertSheetContent } from "@/src/features/profile/components/BalanceAlertSheetContent";
import { ChangePasswordSheetContent } from "@/src/features/profile/components/ChangePasswordSheetContent";
import { EditProfileSheetContent } from "@/src/features/profile/components/EditProfileSheetContent";

type SheetType = "languages" | "wallets" | "balanceAlert" | "editProfile" | "categories" | "paymentMethods" | "changePassword" | null;

type MenuRowProps = {
  label: string;
  onPress?: () => void;
  last?: boolean;
  loading?: boolean;
  danger?: boolean;
};

function MenuRow({ label, onPress, last, loading, danger }: MenuRowProps) {
  return (
    <View>
      <TouchableOpacity style={styles.menuRow} onPress={onPress} disabled={loading} activeOpacity={0.6}>
        <Text style={[styles.menuLabel, danger && { color: colors.danger }]}>{label}</Text>
        {loading ? (
          <ActivityIndicator size="small" color={danger ? colors.danger : colors.primary} />
        ) : danger ? (
          <LogOut size={18} color={colors.danger} strokeWidth={1.8} />
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
  const [loading, setLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [savingItemId, setSavingItemId] = useState<number | null>(null);
  const { data: languages, isLoading: isLanguageLoading } = useCatalog();
  const { isLoading: isProfileLoading } = useUserProfile();

  const [sheetKey, setSheetKey] = useState(0);

  const [sheetSnapPoints, setSheetSnapPoints] = useState(["75%"]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openSheet = (type: SheetType) => {

    setSheetKey((k) => k + 1);
    if (type === "languages") {
      setSheetSnapPoints(languages && languages.length < 3 ? ["35%"] : ["75%"]);
    } else {
      setSheetSnapPoints(["75%"]);
    }
    setSheetType(type);
    bottomSheetRef.current?.present();
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

  if (isLanguageLoading || isProfileLoading) {
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
          <MenuInfoRow label="Versión" info={`v${Constants.expoConfig?.version ?? "1.0.0"}`} />
          <MenuRow label="Cerrar Sesión" onPress={handleLogout} danger loading={loading} last />
        </View>
      </View>
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
        }}
        backdropComponent={renderBackdrop}
      >
        <View key={`${sheetType}-${sheetKey}`} style={{ flex: 1 }}>
        {sheetType === "wallets" ? (
          <WalletsSheetContent onSnapChange={setSheetSnapPoints} />
        ) : sheetType === "balanceAlert" ? (
          <BalanceAlertSheetContent
            onSnapChange={setSheetSnapPoints}
            onClose={() => bottomSheetRef.current?.dismiss()}
          />
        ) : sheetType === "editProfile" ? (
          <EditProfileSheetContent
            onSnapChange={setSheetSnapPoints}
            onClose={() => bottomSheetRef.current?.dismiss()}
          />
        ) : sheetType === "categories" ? (
            <CategoryManagerSheet onSnapChange={setSheetSnapPoints} />
          ) : sheetType === "paymentMethods" ? (
            <PaymentMethodManagerSheet onSnapChange={setSheetSnapPoints} />
          ) : sheetType === "changePassword" ? (
            <ChangePasswordSheetContent
              onClose={() => bottomSheetRef.current?.dismiss()}
            />
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
        </View>
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
});
