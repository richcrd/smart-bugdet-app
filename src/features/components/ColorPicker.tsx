import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import { COLORS_PALETTE } from "@/src/features/constants/colors";

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: Props) {
  return (
    <View style={styles.grid}>
      {COLORS_PALETTE.map((color) => {
        const selected = color === value;
        return (
          <TouchableOpacity
            key={color}
            style={[styles.swatch, { backgroundColor: color }, selected && styles.swatchSelected]}
            onPress={() => onChange(color)}
            activeOpacity={0.7}
          >
            {selected && <Check size={16} color="#fff" strokeWidth={3} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: {
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});