import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { authRepository } from "@/src/features/data/auth";
import { useAuthStore } from "@/src/features/stores/auth.store";
import { configureHttpAuth } from "@/src/shared/http/client";
import { queryClient } from "@/src/shared/http/queryClient";

export const unstable_settings = {
  initialRouteName: "(public)",
};

configureHttpAuth({
  getAccessToken: () => useAuthStore.getState().accessToken,

  async refreshTokens() {
    const { refreshToken, setSession } = useAuthStore.getState();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const session = await authRepository.refresh(refreshToken);
    await setSession(session);
    return session.accessToken;
  },

  logout: () => useAuthStore.getState().clearSession(),
});

export default function RootLayout() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
