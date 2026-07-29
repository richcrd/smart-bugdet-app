import { BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "@/src/features/constants/colors";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  onDone: () => void;
  title?: string;
  maximumDate?: Date;
}

export function DatePickerSheet({ value, onChange, onDone, title, maximumDate }: Props) {
  return (
    <BottomSheetView style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <DateTimePicker
        value={value}
        mode="date"
        display="inline"
        themeVariant="light"
        accentColor="#1A9B5A"
        maximumDate={maximumDate}
        onChange={(_event, selected) => {
          if (selected) {
            onChange(selected);
          }
        }}
      />
      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneText}>Listo</Text>
      </TouchableOpacity>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A0F1E",
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 12,
  },
  doneButton: {
    alignSelf: "stretch",
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
  doneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
