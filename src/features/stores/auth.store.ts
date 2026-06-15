import { create } from "zustand";

import type { AuthSession, LoginRequest } from "@/src/features/data/auth";
import { authRepository } from "@/src/features/data/auth";
import { secureStore } from "@/src/shared/storage/secureJson";
import { STORAGE_KEYS } from "@/src/shared/storage/storageKeys";

type AuthStatus = "hydrating" | "authenticated" | "unauthenticated";

type AuthStore = {
  hasHydrated: boolean;
  status: AuthStatus;
  accessToken: string | null;
  refreshToken: string | null;
  hydrate(): Promise<void>;
  login(request: LoginRequest): Promise<void>;
  setSession(session: AuthSession): Promise<void>;
  clearSession(): Promise<void>;
  logout(): Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  hasHydrated: false,
  status: "hydrating",
  accessToken: null,
  refreshToken: null,

  async hydrate() {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        secureStore.get<string>(STORAGE_KEYS.auth.accessToken),
        secureStore.get<string>(STORAGE_KEYS.auth.refreshToken),
      ]);

      set({
        accessToken,
        refreshToken,
        status:
          accessToken && refreshToken ? "authenticated" : "unauthenticated",
      });
    } catch {
      set({
        accessToken: null,
        refreshToken: null,
        status: "unauthenticated",
      });
    } finally {
      set({ hasHydrated: true });
    }
  },

  async login(request) {
    const session = await authRepository.login(request);
    await get().setSession(session);
  },

  async setSession(session) {
    await Promise.all([
      secureStore.set(STORAGE_KEYS.auth.accessToken, session.accessToken),
      secureStore.set(STORAGE_KEYS.auth.refreshToken, session.refreshToken),
    ]);

    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      status: "authenticated",
    });
  },

  async clearSession() {
    await Promise.all([
      secureStore.remove(STORAGE_KEYS.auth.accessToken),
      secureStore.remove(STORAGE_KEYS.auth.refreshToken),
    ]);

    set({
      accessToken: null,
      refreshToken: null,
      status: "unauthenticated",
    });
  },

  async logout() {
    const refreshToken = get().refreshToken;

    try {
      if (refreshToken) {
        await authRepository.logout(refreshToken);

        const rotatedRefreshToken = get().refreshToken;
        if (rotatedRefreshToken && rotatedRefreshToken !== refreshToken) {
          await authRepository.logout(rotatedRefreshToken);
        }
      }
    } finally {
      await get().clearSession();
    }
  },
}));
