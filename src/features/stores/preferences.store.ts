import { create } from "zustand";

import { preferencesRepository } from "@/src/features/data/preferences";
import { secureStore } from "@/src/shared/storage/secureJson";
import { STORAGE_KEYS } from "@/src/shared/storage/storageKeys";

type PreferencesStore = {
  hasHydrated: boolean;
  languageId: number | null;
  currencyId: number | null;
  notificationsEnabled: boolean | null;
  hydrate(): Promise<void>;
  setLanguage(languageId: number): Promise<void>;
  setCurrency(currencyId: number): Promise<void>;
  setNotificationsEnabled(enabled: boolean): Promise<void>;
  reconcileFromServer(): Promise<void>;
  reset(): Promise<void>;
};

async function persistLocal(languageId: number | null, currencyId: number | null, notificationsEnabled: boolean | null) {
  await Promise.all([
    languageId === null
      ? secureStore.remove(STORAGE_KEYS.preferences.languageId)
      : secureStore.set(STORAGE_KEYS.preferences.languageId, languageId),
    currencyId === null
      ? secureStore.remove(STORAGE_KEYS.preferences.currencyId)
      : secureStore.set(STORAGE_KEYS.preferences.currencyId, currencyId),
    notificationsEnabled === null
      ? secureStore.remove(STORAGE_KEYS.preferences.notificationsEnabled)
      : secureStore.set(STORAGE_KEYS.preferences.notificationsEnabled, notificationsEnabled),
  ]);
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  hasHydrated: false,
  languageId: null,
  currencyId: null,
  notificationsEnabled: null,

  async hydrate() {
    try {
      const [languageId, currencyId, notificationsEnabled] = await Promise.all([
        secureStore.get<number>(STORAGE_KEYS.preferences.languageId),
        secureStore.get<number>(STORAGE_KEYS.preferences.currencyId),
        secureStore.get<boolean>(STORAGE_KEYS.preferences.notificationsEnabled),
      ]);
      set({ languageId, currencyId, notificationsEnabled });
    } catch {
      set({ languageId: null, currencyId: null, notificationsEnabled: null });
    } finally {
      set({ hasHydrated: true });
    }
  },

  async setLanguage(languageId) {
    const previous = get().languageId;
    set({ languageId });
    await secureStore.set(STORAGE_KEYS.preferences.languageId, languageId);

    try {
      await preferencesRepository.update({ languageId });
    } catch (error) {
      set({ languageId: previous });
      await persistLocal(previous, get().currencyId, get().notificationsEnabled);
      throw error;
    }
  },

  async setCurrency(currencyId) {
    const previous = get().currencyId;
    set({ currencyId });
    await secureStore.set(STORAGE_KEYS.preferences.currencyId, currencyId);

    try {
      await preferencesRepository.update({ defaultCurrencyId: currencyId });
    } catch (error) {
      set({ currencyId: previous });
      await persistLocal(get().languageId, previous, get().notificationsEnabled);
      throw error;
    }
  },

  async setNotificationsEnabled(enabled) {
    const previous = get().notificationsEnabled;
    set({ notificationsEnabled: enabled });
    await secureStore.set(STORAGE_KEYS.preferences.notificationsEnabled, enabled);

    try {
      await preferencesRepository.update({ notificationsEnabled: enabled });
    } catch (error) {
      set({ notificationsEnabled: previous });
      await persistLocal(get().languageId, get().currencyId, previous);
      throw error;
    }
  },

  async reconcileFromServer() {
    try {
      const { response } = await preferencesRepository.get();
      set({
        languageId: response.languageId,
        currencyId: response.defaultCurrencyId,
        notificationsEnabled: response.notificationsEnabled,
      });
      await persistLocal(response.languageId, response.defaultCurrencyId, response.notificationsEnabled);
    } catch {

    }
  },

  async reset() {
    await Promise.all([
      secureStore.remove(STORAGE_KEYS.preferences.languageId),
      secureStore.remove(STORAGE_KEYS.preferences.currencyId),
      secureStore.remove(STORAGE_KEYS.preferences.notificationsEnabled),
    ]);
    set({ languageId: null, currencyId: null, notificationsEnabled: null });
  },
}));
