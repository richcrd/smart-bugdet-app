import { create } from "zustand";

import { preferencesRepository } from "@/src/features/data/preferences";
import { secureStore } from "@/src/shared/storage/secureJson";
import { STORAGE_KEYS } from "@/src/shared/storage/storageKeys";

type PreferencesStore = {
  hasHydrated: boolean;
  languageId: number | null;
  currencyId: number | null;
  notificationsEnabled: boolean | null;
  balanceAlertThreshold: number | null;
  hydrate(): Promise<void>;
  setLanguage(languageId: number): Promise<void>;
  setCurrency(currencyId: number): Promise<void>;
  setNotificationsEnabled(enabled: boolean): Promise<void>;
  setBalanceAlertThreshold(threshold: number): Promise<void>;
  reconcileFromServer(): Promise<void>;
  reset(): Promise<void>;
};

async function persistLocal(
  languageId: number | null,
  currencyId: number | null,
  notificationsEnabled: boolean | null,
  balanceAlertThreshold: number | null,
) {
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
    balanceAlertThreshold === null
      ? secureStore.remove(STORAGE_KEYS.preferences.balanceAlertThreshold)
      : secureStore.set(STORAGE_KEYS.preferences.balanceAlertThreshold, balanceAlertThreshold),
  ]);
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  hasHydrated: false,
  languageId: null,
  currencyId: null,
  notificationsEnabled: null,
  balanceAlertThreshold: null,

  async hydrate() {
    try {
      const [languageId, currencyId, notificationsEnabled, balanceAlertThreshold] = await Promise.all([
        secureStore.get<number>(STORAGE_KEYS.preferences.languageId),
        secureStore.get<number>(STORAGE_KEYS.preferences.currencyId),
        secureStore.get<boolean>(STORAGE_KEYS.preferences.notificationsEnabled),
        secureStore.get<number>(STORAGE_KEYS.preferences.balanceAlertThreshold),
      ]);
      set({ languageId, currencyId, notificationsEnabled, balanceAlertThreshold });
    } catch {
      set({ languageId: null, currencyId: null, notificationsEnabled: null, balanceAlertThreshold: null });
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
      await persistLocal(previous, get().currencyId, get().notificationsEnabled, get().balanceAlertThreshold);
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
      await persistLocal(get().languageId, previous, get().notificationsEnabled, get().balanceAlertThreshold);
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
      await persistLocal(get().languageId, get().currencyId, previous, get().balanceAlertThreshold);
      throw error;
    }
  },

  async setBalanceAlertThreshold(threshold) {
    const previous = get().balanceAlertThreshold;
    set({ balanceAlertThreshold: threshold });
    await secureStore.set(STORAGE_KEYS.preferences.balanceAlertThreshold, threshold);

    try {
      await preferencesRepository.update({ balanceAlertThreshold: threshold });
    } catch (error) {
      set({ balanceAlertThreshold: previous });
      await persistLocal(get().languageId, get().currencyId, get().notificationsEnabled, previous);
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
        balanceAlertThreshold: response.balanceAlertThreshold,
      });
      await persistLocal(
        response.languageId,
        response.defaultCurrencyId,
        response.notificationsEnabled,
        response.balanceAlertThreshold,
      );
    } catch {

    }
  },

  async reset() {
    await Promise.all([
      secureStore.remove(STORAGE_KEYS.preferences.languageId),
      secureStore.remove(STORAGE_KEYS.preferences.currencyId),
      secureStore.remove(STORAGE_KEYS.preferences.notificationsEnabled),
      secureStore.remove(STORAGE_KEYS.preferences.balanceAlertThreshold),
    ]);
    set({ languageId: null, currencyId: null, notificationsEnabled: null, balanceAlertThreshold: null });
  },
}));
