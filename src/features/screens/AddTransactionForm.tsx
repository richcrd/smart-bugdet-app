import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useDashboard } from "../hooks/useDashboard";

type TransactionType = "gasto" | "ingreso";


type Props = {
  onSave: () => void;
};

export function AddTransactionForm({ onSave }: Props) {
  const { data: summary } = useDashboard();
  const [type, setType] = useState<TransactionType>("gasto");
  const [amount, setAmount] = useState("");

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
  };

  return (
    <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nuevo movimiento</Text>
        <TouchableOpacity
          onPress={onSave}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={styles.saveBtn}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, type === "gasto" && styles.tabActive]}
          onPress={() => handleTypeChange("gasto")}
        >
          <Text style={[styles.tabLabel, type === "gasto" && styles.tabLabelActive]}>
            Gasto
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, type === "ingreso" && styles.tabActive]}
          onPress={() => handleTypeChange("ingreso")}
        >
          <Text style={[styles.tabLabel, type === "ingreso" && styles.tabLabelActive]}>
            Ingreso
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.currency}>{summary?.currencySymbol ?? ""}</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor="#CBD5E1"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  saveBtn: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2890b3",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  tabLabelActive: {
    color: "#1E293B",
    fontWeight: "600",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    gap: 8,
  },
  currency: {
    fontSize: 28,
    fontWeight: "600",
    color: "#64748B",
  },
  amountInput: {
    fontSize: 42,
    fontWeight: "700",
    color: "#1E293B",
    minWidth: 100,
    maxWidth: "70%",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fieldLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  fieldText: {
    fontSize: 15,
    color: "#334155",
  },
  fieldPlaceholder: {
    color: "#CBD5E1",
  },
  catDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  divider: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginHorizontal: 16,
  },
  descRow: {
    alignItems: "flex-start",
    paddingTop: 14,
  },
  descIcon: {
    marginTop: 2,
  },
  descInput: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    minHeight: 60,
    marginLeft: 12,
  },
  catIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentIcon: {
    width: 20,
    marginRight: 12,
  },
});
