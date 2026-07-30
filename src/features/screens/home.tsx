import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useDashboard, useTransactions } from "../hooks/useDashboard";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "../hooks/useNotifications";
import type { NotificationResponse } from "../data/notifications";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Bell,
} from "lucide-react-native";
import { getIconByKey } from "../constants/iconCatalog";
import { useUserProfile } from "../hooks/useUserProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatCurrency } from "@/src/shared/utils/common";
import { AdBanner } from "../components/AdBanner";
import { colors, getContrastColor } from "../constants/colors";

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Buenos días";
  }
  if (hour < 18) {
    return "Buenas tardes";
  }
  return "Buenas noches";
}

export default function Home() {
  const { data: profile } = useUserProfile();
  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary } = useDashboard();
  const { data: transaction, isLoading: isTransactionLoading, refetch: refetchTransactions } = useTransactions();
  const { data: notifications } = useNotifications();
  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();

  const notificationsSheetRef = useRef<BottomSheet>(null);
  const unreadCount = notifications?.filter((item) => !item.isRead).length ?? 0;
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const renderNotificationsBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  ), []);

  const handleRefresh = () => {
    setIsManualRefreshing(true);
    Promise.all([refetchSummary(), refetchTransactions()]).finally(() => setIsManualRefreshing(false));
  };

  const renderNotificationItem = ({ item }: { item: NotificationResponse }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.notificationItemUnread]}
      onPress={() => !item.isRead && markNotificationRead.mutate(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationTextContainer}>
        <Text style={[styles.notificationTitle, !item.isRead && styles.notificationTitleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <Text style={styles.notificationTime}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (isSummaryLoading || isTransactionLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color="#1E293B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={transaction}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshing={isManualRefreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.headerTitle}>Hola{profile?.firstName ? `, ${profile.firstName}` : ""}!</Text>
              </View>
              <TouchableOpacity style={styles.walletBadge} onPress={() => notificationsSheetRef.current?.expand()}>
                <Bell size={22} color={colors.darkCard} strokeWidth={1.8} />
                {unreadCount > 0 && <View style={styles.notificationBadge} />}
              </TouchableOpacity>
            </View>

            <View style={styles.balanceCard}>
              <View style={styles.balanceCardInner}>
                <Text style={styles.balanceLabel}>Balance disponible</Text>
                <Text
                  style={styles.balanceAmount}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatCurrency(summary?.currentBalance ?? 0, summary?.currencySymbol ?? "")}
                </Text>
                <View style={styles.balanceDivider} />
                <Text style={styles.balanceSubtitle}>Este mes</Text>
              </View>

              <View style={styles.decorCircle1} />
              <View style={styles.decorCircle2} />
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconBox, { backgroundColor: colors.incomeBg }]}>
                  <TrendingUp size={20} color={colors.income} strokeWidth={2} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Ingresos</Text>
                  <Text style={[styles.summaryAmount, { color: colors.income }]}>
                    {formatCurrency(summary?.totalIncomeMonth ?? 0, summary?.currencySymbol ?? "")}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconBox, { backgroundColor: colors.expenseBg }]}>
                  <TrendingDown size={20} color={colors.expense} strokeWidth={2} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Gastos</Text>
                  <Text style={[styles.summaryAmount, { color: colors.expense }]}>
                    {formatCurrency(summary?.totalExpenseMonth ?? 0, summary?.currencySymbol ?? "")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transacciones</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const CategoryIcon = getIconByKey(item.categoryIcon);
          const isExpense = item.transactionTypeCode === "EXPENSE";

          return (
            <View style={styles.transactionCard}>
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: item.categoryColor ?? colors.borderLight },
                ]}
              >
                <CategoryIcon size={18} color={getContrastColor(item.categoryColor ?? colors.borderLight)} strokeWidth={1.8} />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description || item.categoryName}
                </Text>
                <Text style={styles.category}>{item.subcategoryName || item.categoryName}</Text>
                <Text style={styles.date}>{item.transactionDate}</Text>
              </View>

              <View style={styles.amountContainer}>
                <Text style={[styles.amount, {color: isExpense ? colors.expense : colors.income}]}>
                  {isExpense ? "-" : "+"} {formatCurrency(item.amount ?? 0, item.currencySymbol ?? "")}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Wallet size={40} color={colors.textTertiary} strokeWidth={1.2} />
            <Text style={styles.emptyText}>Sin transacciones</Text>
            <Text style={styles.emptySubtext}>
              Tus movimientos aparecerán aquí
            </Text>
          </View>
        }
      />
      <AdBanner />

      <BottomSheet
        ref={notificationsSheetRef}
        index={-1}
        snapPoints={["60%"]}
        enablePanDownToClose={true}
        backdropComponent={renderNotificationsBackdrop}
      >
        <View style={styles.sheetHeaderRow}>
          <Text style={styles.sheetTitle}>Notificaciones</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={() => markAllNotificationsRead.mutate()} style={[styles.iconButton, { marginRight: 20 }]}>
              <Text style={styles.markAllText}>Marcar todas</Text>
            </TouchableOpacity>
          )}
        </View>
        <BottomSheetFlatList
          data={notifications ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.sheetList}
          ListEmptyComponent={
            <Text style={styles.sheetEmpty}>No tienes notificaciones</Text>
          }
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  walletBadge: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    backgroundColor: colors.darkCard,
    borderRadius: 24,
    padding: 28,
    marginBottom: 16,
    overflow: "hidden",
    minHeight: 160,
  },
  balanceCardInner: {
    zIndex: 2,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 16,
  },
  balanceSubtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  decorCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.03)",
    right: -50,
    top: -50,
  },
  decorCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(26,155,90,0.15)",
    right: 20,
    bottom: -20,
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  transactionCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  amountContainer: {
    alignItems: "flex-end",
    gap: 6,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 48,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.darkCard,
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
  iconButton: {
    padding: 6,
  },
  markAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  sheetList: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sheetEmpty: {
    textAlign: "center",
    marginTop: 24,
    color: colors.textSecondary,
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  notificationItemUnread: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    marginBottom: 10,
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  notificationTitleUnread: {
    fontWeight: "700",
  },
  notificationBody: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
});
