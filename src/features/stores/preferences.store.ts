import { create } from "zustand";

import { preferencesRepository } from "@/src/features/data/preferences";
import { secureStore } from "@/src/shared/storage/secureJson";
import { STORAGE_KEYS } from "@/src/shared/storage/storageKeys";

type PreferencesStore = {
  hasHydrated: boolean;
  languageId: number | null;
  currencyId: number | null;
  hydrate(): Promise<void>;
  setLanguage(languageId: number): Promise<void>;
  setCurrency(currencyId: number): Promise<void>;
  reconcileFromServer(): Promise<void>;
  reset(): Promise<void>;
};

async function persistLocal(languageId: number | null, currencyId: number | null) {
  await Promise.all([
    languageId === null
      ? secureStore.remove(STORAGE_KEYS.preferences.languageId)
      : secureStore.set(STORAGE_KEYS.preferences.languageId, languageId),
    currencyId === null
      ? secureStore.remove(STORAGE_KEYS.preferences.currencyId)
      : secureStore.set(STORAGE_KEYS.preferences.currencyId, currencyId),
  ]);
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  hasHydrated: false,
  languageId: null,
  currencyId: null,

  async hydrate() {
    try {
      const [languageId, currencyId] = await Promise.all([
        secureStore.get<number>(STORAGE_KEYS.preferences.languageId),
        secureStore.get<number>(STORAGE_KEYS.preferences.currencyId),
      ]);
      set({ languageId, currencyId });
    } catch {
      set({ languageId: null, currencyId: null });
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
      await persistLocal(previous, get().currencyId);
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
      await persistLocal(get().languageId, previous);
      throw error;
    }
  },

  async reconcileFromServer() {
    try {
      const { response } = await preferencesRepository.get();
      set({ languageId: response.languageId, currencyId: response.defaultCurrencyId });
      await persistLocal(response.languageId, response.defaultCurrencyId);
    } catch {

    }
  },

  async reset() {
    await Promise.all([
      secureStore.remove(STORAGE_KEYS.preferences.languageId),
      secureStore.remove(STORAGE_KEYS.preferences.currencyId),
    ]);
    set({ languageId: null, currencyId: null });
  },
}));
