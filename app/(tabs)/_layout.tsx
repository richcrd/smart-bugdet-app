import { BottomSheetModal } from "@gorhom/bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useCallback, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { AddTransactionForm } from "@/src/features/screens/AddTransactionForm";

const ACTIVE_COLOR = "#2E9E47";

function AddTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.addButtonWrapper} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.addButton}>
        <FontAwesome name="plus" size={24} color="white" />
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

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarStyle: { overflow: "visible" },
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
              <FontAwesome name="money" color={color} size={size} />
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
            title: "Estadísticas",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bar-chart" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" color={color} size={size} />
            ),
          }}
        />
      </Tabs>

      <BottomSheetModal ref={bottomSheetRef} snapPoints={["90%"]}>
        <AddTransactionForm onSave={closeSheet} />
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  addButtonWrapper: {
    top: -22,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2E9E47",
    alignItems: "center",
    justifyContent: "center",
  },
});
