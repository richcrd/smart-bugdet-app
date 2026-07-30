import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { ICON_CATALOG, getIconByKey } from "../constants/iconCatalog";
import { colors } from "../constants/colors";

type Props = {
  value: string;
  onChange: (key: string) => void;
};

export function IconPicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {ICON_CATALOG.map((entry) => {
          const selected = entry.key === value;
          const IconComp = entry.icon;
          return (
            <TouchableOpacity
              key={entry.key}
              style={[styles.iconBtn, selected && styles.iconBtnSelected]}
              onPress={() => onChange(entry.key)}
              activeOpacity={0.6}
            >
              <IconComp size={22} color={selected ? colors.primary : colors.textSecondary} strokeWidth={1.8} />
              <Text style={[styles.iconLabel, selected && styles.iconLabelSelected]} numberOfLines={1}>
                {entry.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.preview}>
        {(() => {
          const PreviewIcon = value ? getIconByKey(value) : ShoppingCart;
          return (
            <View style={[styles.previewIconBox, { backgroundColor: colors.primaryLight }]}>
              <PreviewIcon size={20} color={colors.primary} strokeWidth={1.8} />
            </View>
          );
        })()}
        <Text style={styles.previewText}>
          {ICON_CATALOG.find((i) => i.key === value)?.label ?? "Selecciona un icono"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  scroll: { gap: 8, paddingVertical: 4 },
  iconBtn: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    minWidth: 70,
  },
  iconBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  iconLabelSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  previewIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  previewText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});