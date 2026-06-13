import {
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";

type CustomButtonProps = PressableProps & {
  title: string;
  containerStyle?: ViewStyle;
};

export function CustomButton({
  title,
  containerStyle,
  style,
  ...props
}: CustomButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        containerStyle,
        style,
      ]}
      {...props}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#102A43",
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
