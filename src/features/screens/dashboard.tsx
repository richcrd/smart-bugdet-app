import { Image, Text, View } from "react-native";
import { styles } from "../styles/dashboardStyles";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.menu}>☰</Text>

        <Image
          source={require("../../../assets/images/smb-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.headerTitle}>Inicio</Text>
      </View>
      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Presupuesto Disponible</Text>

        <Text style={styles.budgetAmount}>C$ 7,000</Text>

        <View style={styles.budgetInfo}>
          <Text style={styles.budgetText}>de C$ 18,000</Text>

          <Text style={styles.budgetText}>38% restante</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Resumen rápido</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Ingresos</Text>
          <Text style={styles.incomeText}>18,000</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Gastos</Text>
          <Text style={styles.expenseText}>7,000</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Balance</Text>
          <Text style={styles.balanceText}>11,000</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acciones rápidas</Text>

      <View style={styles.actionsContainer}>
        <View style={styles.actionCard}>
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionText}>Registrar{"\n"}Gasto</Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>Mis{"\n"}Ingresos</Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Reportes</Text>
        </View>
      </View>
    </View>
  );
}
