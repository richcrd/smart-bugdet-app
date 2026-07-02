import Constants, { ExecutionEnvironment } from "expo-constants";
import { StyleSheet, View } from "react-native";

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export function AdBanner() {
  if (isExpoGo) {
    return null;
  }

  const { BannerAd, BannerAdSize, TestIds } = require("react-native-google-mobile-ads");

  return (
    <View style={styles.container}>
      <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
