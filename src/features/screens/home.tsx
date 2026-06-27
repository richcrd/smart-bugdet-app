import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDashboard, useTransactions } from "../hooks/useDashboard";
import {
  Car,
  CircleDollarSign,
  House,
  LucideIcon,
  MoveDown,
  MoveUp,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatAmount } from "@/src/shared/utils/common";

const iconMap: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  car: Car,
  home: House,
  food: UtensilsCrossed,
  salary: CircleDollarSign,
};

export default function Home() {
  const { data: summary, isLoading: isSummaryLoading } = useDashboard();
  const { data: transaction, isLoading: isTransactionLoading } =
    useTransactions();

  //console.log("API ==>", transaction);

  if (isSummaryLoading || isTransactionLoading) {
    return <ActivityIndicator size="small" color="#fff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Inicio</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Balance disponible</Text>

        <Text
          style={styles.balanceAmount}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          C$ {formatAmount(summary?.currentBalance ?? 0)}
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIconContainer,
              { backgroundColor: "#E7F8DF" },
            ]}
          >
            <MoveDown size={24} color="#2E7D32" />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={styles.summaryAmount}>
              C$ {formatAmount(summary?.totalIncomeMonth ?? 0)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIconContainer,
              { backgroundColor: "#FFE1E1" },
            ]}
          >
            <MoveUp size={24} color="#C62828" />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Gastos</Text>
            <Text style={styles.summaryAmount}>
              C$ {formatAmount(summary?.totalExpenseMonth ?? 0)}
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ fontWeight: "700", marginTop: 20, paddingVertical: 10, fontSize: 18 }}>
        Transacciones
      </Text>
      <FlatList
        data={transaction}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const CategoryIcon = iconMap[item.categoryIcon] ?? ShoppingCart;

          return (
            <View style={styles.transactionCard}>
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: item.categoryColor },
                ]}
              >
                <CategoryIcon size={20} color="#334155" />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.description}>
                  {item.description || "Sin descripción"}
                </Text>

                <Text style={styles.category}>{item.categoryName}</Text>

                <Text style={styles.date}>{item.transactionDate}</Text>
              </View>

              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      item.transactionTypeCode === "EXPENSE"
                        ? "#DC2626"
                        : "#16A34A",
                  },
                ]}
              >
                {item.transactionTypeCode === "EXPENSE" ? "-" : "+"}
                C$ {formatAmount(item.amount ?? 0)}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={{ textAlign: "center" }}>No tienes transacciones para mostrar</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FA",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  balanceLabel: {
    color: "#CBD5E1",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryAmount: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  listContent: {
    paddingVertical: 16,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  category: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  date: {
    marginTop: 2,
    fontSize: 12,
    color: "#9CA3AF",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
