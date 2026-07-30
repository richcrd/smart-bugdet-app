import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export async function initializeAds() {
  if (isExpoGo) {
    return;
  }

  const { AdsConsent, MobileAds } = require("react-native-google-mobile-ads");

  await AdsConsent.gatherConsent();

  if (Platform.OS === "ios") {
    await requestTrackingPermissionsAsync();
  }

  await MobileAds().initialize();
}
