import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/AddTransactionStyles";
import type { TransactionType } from "./types";

type Props = {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
};

export function TransactionTypeToggle({ value, onChange }: Props) {
  return (
    <View style={styles.typeContainer}>
      <TouchableOpacity
        style={[styles.typeButton, value === "gasto" && styles.typeButtonExpense]}
        onPress={() => onChange("gasto")}
      >
        <Ionicons name="arrow-down-circle" size={20} color={value === "gasto" ? "#fff" : "#EF4444"} />

        <Text style={[styles.typeText, value === "gasto" && styles.typeTextActive]}>Gasto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.typeButton, value === "ingreso" && styles.typeButtonIncome]}
        onPress={() => onChange("ingreso")}
      >
        <Ionicons name="arrow-up-circle" size={20} color={value === "ingreso" ? "#fff" : "#22C55E"} />

        <Text style={[styles.typeText, value === "ingreso" && styles.typeTextActive]}>Ingreso</Text>
      </TouchableOpacity>
    </View>
  );
}
