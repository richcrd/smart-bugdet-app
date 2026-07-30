import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { notificationsRepository } from "@/src/features/notifications/notifications";

export async function registerForPushNotifications(): Promise<void> {
  if (Platform.OS === "ios" && !Device.isDevice) {
    throw new Error("Las notificaciones push requieren un dispositivo físico en iOS");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("No se otorgaron permisos de notificaciones");
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  
  if (!projectId) {
    throw new Error("No se encontró el projectId de EAS");
  }

  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });

  await notificationsRepository.registerDevice({
    expoPushToken,
    platform: Platform.OS,
  });
}
