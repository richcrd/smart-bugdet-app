import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

import { authRepository } from "@/src/features/data/auth";
import { useAuthStore } from "@/src/features/stores/auth.store";
import { usePreferencesStore } from "@/src/features/stores/preferences.store";
import { configureHttpAuth } from "@/src/shared/http/client";
import { queryClient } from "@/src/shared/http/queryClient";

export const unstable_settings = {
  initialRouteName: "(public)",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

configureHttpAuth({
  getAccessToken: () => useAuthStore.getState().accessToken,

  async refreshSession() {
    const { refreshToken, setSession } = useAuthStore.getState();
    if (!refreshToken) throw new Error("No refresh token available");
    const session = await authRepository.refresh(refreshToken);
    await setSession(session);
    return session.accessToken;
  },

  onLogout: () => useAuthStore.getState().clearSession(),
});

export default function RootLayout() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const status = useAuthStore((state) => state.status);
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydratePreferences = usePreferencesStore((state) => state.hydrate);
  const reconcilePreferences = usePreferencesStore((state) => state.reconcileFromServer);

  useEffect(() => {
    hydrate();
    hydratePreferences();
  }, [hydrate, hydratePreferences]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    
    if (status === "authenticated") {
      reconcilePreferences();
      router.replace("/(tabs)");
    } else if (status === "unauthenticated") {
      router.replace("/(public)");
    }
  }, [hasHydrated, status, reconcilePreferences]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="dark" />
          <Toaster />
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
