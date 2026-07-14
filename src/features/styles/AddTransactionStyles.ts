import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  /* TIPO */

  typeContainer: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 18,
    padding: 5,
    marginBottom: 25,
  },

  typeButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },

  typeButtonExpense: {
    backgroundColor: "#EF4444",
  },

  typeButtonIncome: {
    backgroundColor: "#22C55E",
  },

  typeText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },

  typeTextActive: {
    color: "#FFFFFF",
  },

  /* MONTO */

  amountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 3,
    alignItems: "center",
    marginBottom: 5,
    elevation: 3,
  },

  currency: {
    fontSize: 24,
    color: "#94A3B8",
    marginBottom: 6,
  },

  amountInput: {
    fontSize: 46,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  /* CARD */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    elevation: 3,
    marginBottom: 5,
    overflow: "hidden",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemTitle: {
    fontSize: 14,
    color: "#94A3B8",
  },

  itemValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 78,
  },

  /* DESCRIPCIÓN */

  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    marginBottom: 15,
  },

  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 10,
  },

  descriptionInput: {
    minHeight: 90,
    fontSize: 15,
    color: "#334155",
    textAlignVertical: "top",
  },

  /* BOTÓN */

  saveButton: {
    backgroundColor: "#16A34A",
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    elevation: 3,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 12,
  },
  sheetList: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  sheetItemActive: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
  },

  sheetItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  sheetIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  sheetItemText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "400",
  },

  sheetItemTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  sheetEmpty: {
    textAlign: "center",
    marginTop: 24,
    color: colors.textSecondary,
    fontSize: 14,
  },

  /* DATE PICKER (sheet) */

  datePickerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },

  dateDoneButton: {
    alignSelf: "stretch",
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },

  dateDoneText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
