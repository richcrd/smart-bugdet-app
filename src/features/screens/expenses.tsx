import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactions } from "../hooks/useDashboard";
import { formatCurrency } from "@/src/shared/utils/common";
import { colors } from "../constants/colors";
import { Car, CircleDollarSign, House, ShoppingCart, UtensilsCrossed, Wallet } from "lucide-react-native";

type TransactionItem = {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  transactionTypeCode: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  currencySymbol: string;
};

const iconMap: Record<string, React.ComponentType<any>> = {
  "shopping-cart": ShoppingCart,
  car: Car,
  home: House,
  food: UtensilsCrossed,
  salary: CircleDollarSign,
};

export default function Expenses() {
  const { data: transactions, isLoading, isRefetching, refetch } = useTransactions();

  const expenses = useMemo(
    () => (
      transactions ?? []).filter((item) => item.transactionTypeCode === "EXPENSE"),
    [transactions]
  );

  const totalExpense = useMemo(
    () => expenses.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [expenses]
  );

  const renderItem = ({ item }: { item: TransactionItem }) => {
    const Icon = iconMap[item.categoryIcon] ?? ShoppingCart;
    return (
      <View style={styles.transactionCard}>
        <View style={[styles.iconBox, { backgroundColor: item.categoryColor ?? colors.borderLight }]}> 
          <Icon size={20} color={colors.textPrimary} strokeWidth={1.8} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle} numberOfLines={2}>
            {item.description || "Compra"}
          </Text>
          <Text style={styles.transactionSubtitle}>{item.categoryName}</Text>
          <Text style={styles.transactionDate}>{item.transactionDate}</Text>
        </View>
        <Text style={styles.amountText}>- {formatCurrency(item.amount ?? 0, item.currencySymbol ?? "")}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Mis Gastos</Text>
              <Text style={styles.subtitle}>Últimos 7 días</Text>
            </View>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalExpense, expenses[0]?.currencySymbol ?? "C$")}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Wallet size={40} color={colors.textTertiary} strokeWidth={1.4} />
            <Text style={styles.emptyTitle}>No hay gastos</Text>
            <Text style={styles.emptySubtitle}>Añade un movimiento para verlo aquí.</Text>
          </View>
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalCard: {
    marginTop: 16,
    backgroundColor: colors.bgCard,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: "800",
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  amountText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.expense,
  },
  emptyContainer: {
    marginTop: 56,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 240,
  },
});