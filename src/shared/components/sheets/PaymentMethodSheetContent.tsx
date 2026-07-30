import { Text, TouchableOpacity, View } from "react-native";
import { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { Check, CreditCard } from "lucide-react-native";
import type { UserPaymentMethodResponse } from "@/src/features/profile/api/catalog";
import { colors } from "@/src/shared/constants/colors";
import { styles } from "@/src/shared/styles/forms";
import type { SelectableItem } from "@/src/features/transactions/components/types";

type Props = {
  paymentMethods: UserPaymentMethodResponse[] | undefined;
  selectedPaymentMethod: SelectableItem | null;
  onSelect: (item: SelectableItem) => void;
};

export function PaymentMethodPickerSheet({ paymentMethods, selectedPaymentMethod, onSelect }: Props) {
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
              onPress={() => onSelect({ id: item.id, name: item.name, paymentMethodId: item.paymentMethodId })}
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
