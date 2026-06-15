import * as SecureStore from "expo-secure-store";

export const secureStore = {
  async set<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);

    if (serialized === undefined) {
      throw new Error(`Cannot serialize value for key "${key}"`);
    }

    await SecureStore.setItemAsync(key, serialized);
  },

  async get<T>(key: string): Promise<T | null> {
    const value = await SecureStore.getItemAsync(key);
    return value === null ? null : (JSON.parse(value) as T);
  },

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};
