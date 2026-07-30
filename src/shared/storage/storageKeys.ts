export const STORAGE_KEYS = {
  auth: {
    accessToken: "smb.jwt",
    refreshToken: "smb.refresh",
  },
  preferences: {
    languageId: "smb.preferences.languageId",
    currencyId: "smb.preferences.currencyId",
    notificationsEnabled: "smb.preferences.notificationsEnabled",
    balanceAlertThreshold: "smb.preferences.balanceAlertThreshold",
  },
} as const;
