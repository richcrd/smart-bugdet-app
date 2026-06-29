import axios from "axios";

import { ENV } from "@/src/config/env";
import { http } from "@/src/shared/http/requests";
import type { ApiResponse } from "@/src/shared/http/requests";

export type LoginRequest = {
  emailOrPhone: string;
  password: string;
  deviceId?: string;
  deviceName?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  birthDate: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  currencyCode?: string;
  languageCode?: string;
};

export type RegisterResponse = {
  peopleId: number;
  userId: number;
  walletId: number;
  fullName: string;
  userName: string;
  email: string;
};

export const authRepository = {
  login: (body: LoginRequest) =>
    http.post<AuthSession>("/service/auth/login", body),

  register: (body: RegisterRequest) =>
    http.post<RegisterResponse>("/service/auth/register", body),

  async refresh(refreshToken: string): Promise<AuthSession> {
    const { data } = await axios.post<ApiResponse<AuthSession>>(
      `${ENV.API_BASE_URL}/service/auth/refresh`,
      { refreshToken },
      { headers: { Accept: "application/json" } },
    );
    return data.response;
  },

  logout: (refreshToken: string) =>
    http.post<null>("/service/auth/logout", { refreshToken }),

  logoutAll: () => http.post<null>("/service/auth/logout-all"),
};
