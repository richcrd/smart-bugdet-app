import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDashboard, useTransactions } from "../hooks/useDashboard";
import {
  Car,
  CircleDollarSign,
  House,
  LucideIcon,
  ShoppingCart,
  UtensilsCrossed,
  TrendingDown,
  TrendingUp,
  Wallet,
  Bell,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatCurrency } from "@/src/shared/utils/common";
import { colors } from "../constants/colors";
import { toast } from "sonner-native";

const iconMap: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  car: Car,
  home: House,
  food: UtensilsCrossed,
  salary: CircleDollarSign,
};

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
  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary, isRefetching: isRefetchingSummary } = useDashboard();
  const { data: transaction, isLoading: isTransactionLoading, refetch: refetchTransactions, isRefetching: isRefetchingTransactions } = useTransactions();

  const handleRefresh = () => {
    refetchSummary();
    refetchTransactions();
  };

  const handleComingSoon = (value: string) => {
    toast.info(`${value} próximamente`)
  }

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
        refreshing={isRefetchingSummary || isRefetchingTransactions}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.headerTitle}>Hola!</Text>
              </View>
              <TouchableOpacity style={styles.walletBadge} onPress={() => handleComingSoon('Notificaciones')}>
                <Bell size={22} color={colors.darkCard} strokeWidth={1.8} />
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
          const CategoryIcon = iconMap[item.categoryIcon] ?? ShoppingCart;
          const isExpense = item.transactionTypeCode === "EXPENSE";

          return (
            <View style={styles.transactionCard}>
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: item.categoryColor ?? colors.borderLight },
                ]}
              >
                <CategoryIcon size={18} color={colors.textPrimary} strokeWidth={1.8} />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description || "Sin descripción"}
                </Text>
                <Text style={styles.category}>{item.categoryName}</Text>
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
});
