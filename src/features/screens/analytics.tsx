import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Path, Circle, Line } from "react-native-svg";
import { useDashboard, useTransactions } from "../hooks/useDashboard";
import { formatCurrency } from "@/src/shared/utils/common";
import { colors } from "../constants/colors";
import { TrendingUp, TrendingDown, CircleDollarSign } from "lucide-react-native";

type TrendPoint = {
  label: string;
  value: number;
  key: string;
};

type TransactionItem = {
  id: number;
  amount: number;
  transactionDate: string;
  transactionTypeCode: string;
};

function parseTransactionDate(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const normalized = value.replace(/\./g, "").replace(/-/g, "/");
  return new Date(normalized);
}

export default function Analytics() {
  const { data: summary, isLoading: isSummaryLoading, refetch: refetchSummary, isRefetching: isRefetchingSummary } = useDashboard();
  const { data: transactions, isLoading: isTransactionsLoading, refetch: refetchTransactions, isRefetching: isRefetchingTransactions } = useTransactions();

  const trendData = useMemo<TrendPoint[]>(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const label = date.toLocaleString("es-ES", { month: "short" }).replace(".", "");
      return { label, value: 0, key: `${date.getFullYear()}-${date.getMonth() + 1}` };
    });

    (transactions ?? []).forEach((transaction: TransactionItem) => {
      if (transaction.transactionTypeCode !== "EXPENSE") return;
      const date = parseTransactionDate(transaction.transactionDate);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const month = months.find((item) => item.key === key);
      if (month) {
        month.value += transaction.amount ?? 0;
      }
    });

    return months;
  }, [transactions]);

  const isLoading = isSummaryLoading || isTransactionsLoading;
  const totalExpense = summary?.totalExpenseMonth ?? 0;
  const totalIncome = summary?.totalIncomeMonth ?? 0;
  const available = summary?.currentBalance ?? 0;
  const symbol = summary?.currencySymbol ?? "C$";

  const chartDimensions = useMemo(() => {
    const screenWidth = Dimensions.get("window").width;
    const width = screenWidth - 72;
    const height = 160;
    const padding = 20;
    const maxValue = Math.max(...trendData.map((item) => item.value), 1);
    const stepX = (width - padding * 2) / Math.max(trendData.length - 1, 1);

    const points = trendData.map((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (item.value / maxValue) * (height - padding * 2);
      return { x, y };
    });

    return {
      path: points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" "),
      width,
      height,
      padding,
    };
  }, [trendData]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingSummary || isRefetchingTransactions}
            onRefresh={() => {
              refetchSummary();
              refetchTransactions();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.title}>Análisis Mensual</Text>
        <View style={styles.cardRow}>
          <View style={[styles.analysisCard, styles.expenseCard]}>
            <Text style={styles.cardLabel}>Gastos</Text>
            <Text style={styles.cardValue}>{formatCurrency(totalExpense, symbol)}</Text>
            <View style={styles.cardBadge}>
              <TrendingDown size={14} color={colors.expense} strokeWidth={2} />
              <Text style={styles.cardBadgeText}>Gastos</Text>
            </View>
          </View>
          <View style={[styles.analysisCard, styles.incomeCard]}>
            <Text style={styles.cardLabel}>Ingresos</Text>
            <Text style={styles.cardValue}>{formatCurrency(totalIncome, symbol)}</Text>
            <View style={styles.cardBadge}>
              <TrendingUp size={14} color={colors.income} strokeWidth={2} />
              <Text style={styles.cardBadgeText}>Ingresos</Text>
            </View>
          </View>
          <View style={[styles.analysisCard, styles.availableCard]}>
            <Text style={styles.cardLabel}>Disponible</Text>
            <Text style={styles.cardValue}>{formatCurrency(available, symbol)}</Text>
            <View style={styles.cardBadge}>
              <CircleDollarSign size={14} color={colors.primary} strokeWidth={2} />
              <Text style={styles.cardBadgeText}>Saldo</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Tendencias de gastos</Text>
          <View style={styles.chartWrapper}>
            <Svg width={chartDimensions.width} height={chartDimensions.height}>
              {[0, 1, 2, 3].map((index) => {
                const y = 40 + index * 30;
                return <Line key={index} x1={chartDimensions.padding} x2={chartDimensions.width - chartDimensions.padding} y1={y} y2={y} stroke={colors.border} strokeWidth={1} opacity={0.3} />;
              })}
              <Path d={chartDimensions.path} fill="none" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              {trendData.map((item, index) => {
                const maxValue = Math.max(...trendData.map((t) => t.value), 1);
                const stepX = (chartDimensions.width - chartDimensions.padding * 2) / Math.max(trendData.length - 1, 1);
                const x = chartDimensions.padding + index * stepX;
                const y = chartDimensions.height - chartDimensions.padding - (item.value / maxValue) * (chartDimensions.height - chartDimensions.padding * 2);
                return <Circle key={item.key} cx={x} cy={y} r={4} fill={colors.primary} />;
              })}
            </Svg>
            <View style={styles.labelsRow}>
              {trendData.map((item) => (
                <Text key={item.key} style={styles.chartLabel}>
                  {item.label}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {trendData.every((point) => point.value === 0) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aún no hay datos de gastos</Text>
            <Text style={styles.emptyDescription}>Registra transacciones para ver el análisis y la tendencia aquí.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },
  analysisCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 140,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  expenseCard: {
    backgroundColor: colors.expenseBg,
  },
  incomeCard: {
    backgroundColor: colors.incomeBg,
  },
  availableCard: {
    backgroundColor: colors.bgCard,
  },
  cardLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  cardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardBadgeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  chartSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 14,
  },
  chartWrapper: {
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  emptyState: {
    marginTop: 28,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
});