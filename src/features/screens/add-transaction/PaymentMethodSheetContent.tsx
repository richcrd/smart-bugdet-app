import { Text, TouchableOpacity, View } from "react-native";
import { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { Check, CreditCard } from "lucide-react-native";
import type { PaymentMethodResponse } from "../../data/catalog";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/AddTransactionStyles";
import type { SelectableItem } from "./types";

type Props = {
  paymentMethods: PaymentMethodResponse[] | undefined;
  selectedPaymentMethod: SelectableItem | null;
  onSelect: (item: SelectableItem) => void;
};

export function PaymentMethodSheetContent({ paymentMethods, selectedPaymentMethod, onSelect }: Props) {
  return (
    <>
      <Text style={styles.sheetTitle}>Métodos de pago</Text>

      <BottomSheetFlashList
        data={paymentMethods ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isActive = selectedPaymentMethod?.id === item.id;

          return (
            <TouchableOpacity
              style={[styles.sheetItem, isActive && styles.sheetItemActive]}
              onPress={() => onSelect(item)}
              activeOpacity={0.6}
            >
              <View style={styles.sheetItemLeft}>
                <View style={[styles.sheetIconBox, { backgroundColor: colors.primaryLight }]}>
                  <CreditCard size={18} color={colors.primary} strokeWidth={1.8} />
                </View>

                <Text style={[styles.sheetItemText, isActive && styles.sheetItemTextActive]}>
                  {item.name}
                </Text>
              </View>

              {isActive && <Check size={18} color={colors.primary} strokeWidth={2} />}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.sheetList}
        ListEmptyComponent={<Text style={styles.sheetEmpty}>No se encontraron métodos de pago</Text>}
      />
    </>
  );
}
