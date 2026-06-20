import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

const ACTIVE_COLOR = "#2E9E47";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
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
          )
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="star" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          )
        }}
      />
    </Tabs>
  );
}
