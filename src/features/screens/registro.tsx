import { ScrollView, Text, View } from "react-native";

import { CustomButton } from "../components/CustomButton";
import { Header } from "../components/Header";
import { registroStyles } from "../styles/RegistroStyles";

export default function RegistroScreen() {
  return (
    <ScrollView contentContainerStyle={registroStyles.container}>
      <Header title="Registro" subtitle="Crea un nuevo movimiento" />
      <View style={registroStyles.card}>
        <Text style={registroStyles.description}>
          Formulario base para registrar ingresos o gastos.
        </Text>
        <CustomButton title="Guardar" onPress={() => {}} />
      </View>
    </ScrollView>
  );
}
