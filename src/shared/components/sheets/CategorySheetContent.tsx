import { Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { Check, ChevronLeft, ChevronRight } from "lucide-react-native";
import type { CategoryResponse, SubcategoryResponse } from "@/src/features/profile/api/catalog";
import { colors, getContrastColor } from "@/src/shared/constants/colors";
import { getIconByKey } from "@/src/shared/constants/iconCatalog";
import { styles } from "@/src/shared/styles/forms";
import type { SelectableItem } from "@/src/features/transactions/components/types";

type Props = {
  categories: CategoryResponse[] | undefined;
  selectedCategory: SelectableItem | null;
  onSelect: (item: SelectableItem, subcategory?: SelectableItem | null) => void;
};

export function CategoryPickerSheet({ categories, selectedCategory, onSelect }: Props) {
  const [step, setStep] = useState<"categories" | "subcategories">("categories");
  const [activeCategory, setActiveCategory] = useState<CategoryResponse | null>(null);

  const handleSelectCategory = (cat: CategoryResponse) => {
    if (cat.subcategories.length > 0) {
      setActiveCategory(cat);
      setStep("subcategories");
    } else {
      onSelect({ id: cat.id, name: cat.name });
    }
  };

  const handleSelectSubcategory = (sub?: SubcategoryResponse) => {
    if (!activeCategory) return;
    if (sub) {
      onSelect({ id: activeCategory.id, name: activeCategory.name }, { id: sub.id, name: sub.name });
    } else {
      onSelect({ id: activeCategory.id, name: activeCategory.name });
    }
  };

  if (step === "subcategories" && activeCategory) {
    return (
      <>
        <View style={localStyles.headerRow}>
          <TouchableOpacity onPress={() => setStep("categories")} style={localStyles.backBtn}>
            <ChevronLeft size={20} color={colors.primary} strokeWidth={2} />
            <Text style={localStyles.backText}>Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.sheetTitle}>{activeCategory.name}</Text>
          <View style={localStyles.backBtn} />
        </View>
        <BottomSheetFlashList
          data={activeCategory.subcategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const SubIcon = getIconByKey(item.icon);
            return (
              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => handleSelectSubcategory(item)}
                activeOpacity={0.6}
              >
                <View style={styles.sheetItemLeft}>
                  <View style={[styles.sheetIconBox, { backgroundColor: activeCategory.color || colors.borderLight }]}>
                    <SubIcon size={18} color={getContrastColor(activeCategory.color || colors.borderLight)} strokeWidth={1.8} />
                  </View>
                  <Text style={styles.sheetItemText}>{item.name}</Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
              </TouchableOpacity>
            );
          }}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => handleSelectSubcategory()}
              activeOpacity={0.6}
            >
              <View style={styles.sheetItemLeft}>
                <View style={[styles.sheetIconBox, { backgroundColor: activeCategory.color || colors.borderLight }]}>
                  <Check size={18} color={colors.textPrimary} strokeWidth={2} />
                </View>
                <Text style={styles.sheetItemText}>Ninguna</Text>
              </View>
            </TouchableOpacity>
          }
          contentContainerStyle={styles.sheetList}
        />
      </>
    );
  }

  return (
    <>
      <Text style={styles.sheetTitle}>Categorías</Text>
      <BottomSheetFlashList
        data={categories ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const CategoryIcon = getIconByKey(item.icon);
          const isActive = selectedCategory?.id === item.id;
          const hasSubs = item.subcategories.length > 0;

          return (
            <TouchableOpacity
              style={[styles.sheetItem, isActive && styles.sheetItemActive]}
              onPress={() => handleSelectCategory(item)}
              activeOpacity={0.6}
            >
              <View style={styles.sheetItemLeft}>
                <View style={[styles.sheetIconBox, { backgroundColor: item.color ?? colors.borderLight }]}>
                  <CategoryIcon size={18} color={getContrastColor(item.color ?? colors.borderLight)} strokeWidth={1.8} />
                </View>
                <Text style={[styles.sheetItemText, isActive && styles.sheetItemTextActive]}>
                  {item.name}
                </Text>
              </View>
              {isActive && <Check size={18} color={colors.primary} strokeWidth={2} />}
              {!isActive && hasSubs && <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.sheetList}
        ListEmptyComponent={<Text style={styles.sheetEmpty}>No se encontraron categorías</Text>}
      />
    </>
  );
}

const localStyles = {
  headerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    width: 80,
  },
  backText: {
    color: colors.primary,
    fontSize: 15,
    marginLeft: 2,
  },
};
