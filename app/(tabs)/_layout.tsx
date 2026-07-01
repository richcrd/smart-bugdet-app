import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useCallback, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BarChart3, User, Plus, Banknote } from "lucide-react-native";

import { AddTransactionForm } from "@/src/features/screens/AddTransactionForm";
import { colors }from "@/src/features/constants/colors";

function AddTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.addButtonWrapper} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.addButton}>
        <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.6}
    />
  ), []);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: styles.tabs,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: "Gastos",
            tabBarIcon: ({ color, size }) => (
              <Banknote size={size - 2} color={color} strokeWidth={1.8} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "",
            tabBarButton: () => <AddTabButton onPress={openSheet} />,
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Análisis",
            tabBarIcon: ({ color, size }) => (
              <BarChart3 size={size - 2} color={color} strokeWidth={1.8} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <User size={size - 2} color={color} strokeWidth={1.8} />
            ),
          }}
        />
      </Tabs>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["90%"]}
        backdropComponent={renderBackdrop}
      >
        <AddTransactionForm onSave={closeSheet} />
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  addButtonWrapper: {
    top: -10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
  }
});
