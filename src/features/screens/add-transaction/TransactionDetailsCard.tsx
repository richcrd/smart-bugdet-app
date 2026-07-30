import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/AddTransactionStyles";

type Props = {
  categoryName: string | undefined;
  subcategoryName: string | undefined;
  paymentMethodName: string | undefined;
  dateLabel: string;
  onPressCategory: () => void;
  onPressPaymentMethod: () => void;
  onPressDate: () => void;
};

export function TransactionDetailsCard({
  categoryName,
  subcategoryName,
  paymentMethodName,
  dateLabel,
  onPressCategory,
  onPressPaymentMethod,
  onPressDate,
}: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.itemRow} onPress={onPressCategory}>
        <View style={styles.leftContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="pricetag-outline" size={20} color="#F97316" />
          </View>

          <View>
            <Text style={styles.itemTitle}>Categoría</Text>
            <Text style={styles.itemValue}>{categoryName || "Seleccionar"}</Text>
            {subcategoryName && <Text style={styles.itemSubvalue}>{subcategoryName}</Text>}
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.itemRow} onPress={onPressPaymentMethod}>
        <View style={styles.leftContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="card-outline" size={20} color="#3B82F6" />
          </View>

          <View>
            <Text style={styles.itemTitle}>Método de pago</Text>
            <Text style={styles.itemValue}>{paymentMethodName || "Seleccionar"}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.itemRow} onPress={onPressDate}>
        <View style={styles.leftContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
          </View>

          <View>
            <Text style={styles.itemTitle}>Fecha</Text>
            <Text style={styles.itemValue}>{dateLabel}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
}
