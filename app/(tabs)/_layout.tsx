import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace("/(public)");
          },
        }}
      />
    </Tabs>
  );
}
