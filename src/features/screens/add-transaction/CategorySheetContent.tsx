import { Text, TouchableOpacity, View } from "react-native";
import { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import {
  Car,
  Check,
  CircleDollarSign,
  House,
  LucideIcon,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react-native";
import type { CategoryResponse } from "../../data/catalog";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/AddTransactionStyles";
import type { SelectableItem } from "./types";

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  car: Car,
  home: House,
  food: UtensilsCrossed,
  salary: CircleDollarSign,
};

type Props = {
  categories: CategoryResponse[] | undefined;
  selectedCategory: SelectableItem | null;
  onSelect: (item: SelectableItem) => void;
};

export function CategorySheetContent({ categories, selectedCategory, onSelect }: Props) {
  return (
    <>
      <Text style={styles.sheetTitle}>Categorías</Text>

      <BottomSheetFlashList
        data={categories ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const CategoryIcon = CATEGORY_ICON_MAP[item.icon] ?? ShoppingCart;
          const isActive = selectedCategory?.id === item.id;

          return (
            <TouchableOpacity
              style={[styles.sheetItem, isActive && styles.sheetItemActive]}
              onPress={() => onSelect(item)}
              activeOpacity={0.6}
            >
              <View style={styles.sheetItemLeft}>
                <View
                  style={[
                    styles.sheetIconBox,
                    { backgroundColor: item.color ?? colors.borderLight },
                  ]}
                >
                  <CategoryIcon size={18} color={colors.textPrimary} strokeWidth={1.8} />
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
        ListEmptyComponent={<Text style={styles.sheetEmpty}>No se encontraron categorías</Text>}
      />
    </>
  );
}
