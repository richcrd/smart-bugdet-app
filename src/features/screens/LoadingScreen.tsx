import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

import { colors } from "../constants/colors";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../../assets/animations/money-transfer.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 220,
    height: 220,
  },
});
