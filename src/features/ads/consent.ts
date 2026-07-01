import { Platform } from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { AdsConsent, MobileAds } from "react-native-google-mobile-ads";

export async function initializeAds() {
  await AdsConsent.gatherConsent();

  if (Platform.OS === "ios") {
    await requestTrackingPermissionsAsync();
  }

  await MobileAds().initialize();
}
