import { http } from "@/src/shared/http/requests";

export type UserPreferenceResponse = {
  userId: number;
  defaultCurrencyId: number;
  defaultCurrencyCode: string;
  languageId: number;
  languageCode: string;
  darkModeEnabled: boolean;
  notificationsEnabled: boolean;
};

export type UpdateUserPreferenceRequest = {
  defaultCurrencyId?: number;
  languageId?: number;
};

export const preferencesRepository = {
  get: () => {
    return http.get<UserPreferenceResponse>("/service/user/preferences");
  },

  update: (body: UpdateUserPreferenceRequest) => {
    return http.put<UserPreferenceResponse>("/service/user/preferences", body);
  }
};
