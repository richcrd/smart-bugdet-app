import { Text, TouchableOpacity } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/AddTransactionStyles";

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  onDone: () => void;
};

export function DateSheetContent({ date, onChange, onDone }: Props) {
  return (
    <BottomSheetView style={styles.datePickerContainer}>
      <Text style={styles.sheetTitle}>Fecha</Text>

      <DateTimePicker
        value={date}
        mode="date"
        display="inline"
        themeVariant="light"
        accentColor={colors.primary}
        maximumDate={new Date()}
        onChange={(_event, selected) => {
          if (selected) {
            onChange(selected);
          }
        }}
      />

      <TouchableOpacity style={styles.dateDoneButton} onPress={onDone}>
        <Text style={styles.dateDoneText}>Listo</Text>
      </TouchableOpacity>
    </BottomSheetView>
  );
}
