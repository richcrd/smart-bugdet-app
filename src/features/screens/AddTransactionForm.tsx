import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDashboard } from "../hooks/useDashboard";
import { styles } from "../styles/AddTransactionStyles";



type TransactionType = "gasto" | "ingreso";


type Props = {
  onSave: () => void;
};

export function AddTransactionForm({ onSave }: Props) {
  const { data: summary } = useDashboard();
  const [type, setType] = useState<TransactionType>("gasto");
  const [amount, setAmount] = useState("");

  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={20}
  >


  <BottomSheetScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
  >
    {/* Header */}

<View style={styles.header}>

  <View style={styles.headerCenter}>
    <Text style={styles.title}>Nuevo movimiento</Text>

    <Text style={styles.subtitle}>
      Registra un gasto o ingreso
    </Text>
  </View>

</View>

    {/* Tipo */}
    <View style={styles.typeContainer}>
      <TouchableOpacity
        style={[
          styles.typeButton,
          type === "gasto" && styles.typeButtonExpense,
        ]}
        onPress={() => handleTypeChange("gasto")}
      >
        <Ionicons
          name="arrow-down-circle"
          size={20}
          color={type === "gasto" ? "#fff" : "#EF4444"}
        />

        <Text
          style={[
            styles.typeText,
            type === "gasto" && styles.typeTextActive,
          ]}
        >
          Gasto
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeButton,
          type === "ingreso" && styles.typeButtonIncome,
        ]}
        onPress={() => handleTypeChange("ingreso")}
      >
        <Ionicons
          name="arrow-up-circle"
          size={20}
          color={type === "ingreso" ? "#fff" : "#22C55E"}
        />

        <Text
          style={[
            styles.typeText,
            type === "ingreso" && styles.typeTextActive,
          ]}
        >
          Ingreso
        </Text>
      </TouchableOpacity>
    </View>

    {/* Monto */}

    <View style={styles.amountCard}>

      <Text style={styles.currency}>
        {summary?.currencySymbol ?? "C$"}
      </Text>

      <TextInput
        style={styles.amountInput}
        placeholder="0.00"
        placeholderTextColor="#CBD5E1"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

    </View>

    {/* Tarjeta */}

    <View style={styles.card}>

      {/* Categoria */}

      <TouchableOpacity style={styles.itemRow}>

        <View style={styles.leftContent}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="pricetag-outline"
              size={20}
              color="#F97316"
            />
          </View>

          <View>
            <Text style={styles.itemTitle}>
              Categoría
            </Text>

            <Text style={styles.itemValue}>
              {category || "Seleccionar"}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>

      <View style={styles.separator} />

      {/* Metodo */}

      <TouchableOpacity style={styles.itemRow}>

        <View style={styles.leftContent}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="card-outline"
              size={20}
              color="#3B82F6"
            />
          </View>

          <View>
            <Text style={styles.itemTitle}>
              Método de pago
            </Text>

            <Text style={styles.itemValue}>
              {paymentMethod || "Seleccionar"}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>

      <View style={styles.separator} />

      {/* Fecha */}

      <TouchableOpacity style={styles.itemRow}>

        <View style={styles.leftContent}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#8B5CF6"
            />
          </View>

          <View>
            <Text style={styles.itemTitle}>
              Fecha
            </Text>

            <Text style={styles.itemValue}>
              {date.toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>

    </View>

    {/* Descripcion */}

    <View style={styles.descriptionCard}>

      <Text style={styles.descriptionTitle}>
        Descripción
      </Text>

      <TextInput
        style={styles.descriptionInput}
        multiline
        numberOfLines={4}
        placeholder="Agregar una descripción..."
        placeholderTextColor="#94A3B8"
        value={description}
        onChangeText={setDescription}
      />

    </View>

    {/* Boton */}

    <TouchableOpacity
      style={styles.saveButton}
      onPress={onSave}
    >
      
      <Text style={styles.saveButtonText}>
        Guardar movimiento
      </Text>
    </TouchableOpacity>

  </BottomSheetScrollView>
    </KeyboardAvoidingView>
);
}



