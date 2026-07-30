import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="h-1 w-full bg-[#2E9E47]" />

      <View className="flex-1 justify-center items-center px-10">
        <Image
          source={require("../../../assets/images/smb-logo.png")}
          className="w-[320px] h-[300px]"
          resizeMode="contain"
        />

        <View className="items-center mb-16">
          <Text className="text-center text-gray-500 text-base leading-7">
            Organiza y controla tus{"\n"}
            gastos y administra tu dinero.
          </Text>
        </View>

        <TouchableOpacity
          className="w-full bg-[#2E9E47] py-[18px] rounded-2xl items-center mb-4"
          style={{
            shadowColor: "#2E9E47",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={() => router.push("/login")}
          activeOpacity={0.9}
        >
          <Text className="text-white text-[17px] font-bold tracking-wide">Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full border-[1.5px] border-[#2E9E47] py-[18px] rounded-2xl items-center bg-white"
          onPress={() => router.push("/registro")}
          activeOpacity={0.9}
        >
          <Text className="text-[#2E9E47] text-[17px] font-bold tracking-wide">Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
