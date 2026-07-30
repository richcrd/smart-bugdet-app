import { Component, type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#F8FAFC" }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 8 }}>
            Algo salió mal
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>
            {this.state.error?.message || "Ocurrió un error inesperado"}
          </Text>
          <TouchableOpacity
            onPress={this.handleRetry}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
