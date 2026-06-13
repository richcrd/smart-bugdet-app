import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#74b7f5",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  menu: {
    fontSize: 28,
    marginRight: 15,
    color: "#2E9E47",
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },

  budgetCard: {
    backgroundColor: "#2E9E47",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },

  budgetLabel: {
    color: "#FFF",
    fontSize: 14,
  },

  budgetAmount: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },

  budgetInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  budgetText: {
    color: "#FFF",
    fontSize: 12,
  },

  progressBar: {
    height: 10,
    backgroundColor: "#65C37A",
    borderRadius: 10,
  },

  progressFill: {
    width: "38%",
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 25,
  },

  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  summaryCard: {
    width: "31%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 3,
  },

  cardTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },

  incomeText: {
    color: "#2E9E47",
    fontWeight: "bold",
    fontSize: 15,
  },

  expenseText: {
    color: "#E74C3C",
    fontWeight: "bold",
    fontSize: 15,
  },

  balanceText: {
    color: "#3498DB",
    fontWeight: "bold",
    fontSize: 15,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "31%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
  },

  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  actionText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  navText: {
    textAlign: "center",
    fontSize: 22,
  },

  navLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#2E9E47",
  },

  logo: {
    width: 60,
    height: 50,
    marginRight: 10,
  },
});
