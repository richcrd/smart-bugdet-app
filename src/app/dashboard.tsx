import { router } from "expo-router"; //
import { Image, Text, TouchableOpacity, View } from "react-native";
// Importa el logo para usarlo como marca de agua
import { styles } from "../styles/dashboardStboaryles";
//importa los estilos para el dashboard
//

export default function Dashboard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.menu}>☰</Text>

        <Image
          source={require("../../assets/images/logo movi.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.headerTitle}>Inicio</Text>
      </View>
      {/* Presupuesto */}
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

      {/* Resumen */}
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

      {/* Acciones rápidas */}
      <Text style={styles.sectionTitle}>Acciones rápidas</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/gastos")}
        >
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionText}>Registrar{"\n"}Gasto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/ingresos")}
        >
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>Mis{"\n"}Ingresos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/reportes")}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Reportes</Text>
        </TouchableOpacity>
      </View>

      {/* Navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Text style={styles.navText}>🏠</Text>
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/gastos")}>
          <Text style={styles.navText}>📋</Text>
          <Text style={styles.navLabel}>Gastos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/ingresos")}>
          <Text style={styles.navText}>💰</Text>
          <Text style={styles.navLabel}>Ingresos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Text style={styles.navText}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
