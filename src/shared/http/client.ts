import { AxiosError, create, InternalAxiosRequestConfig } from "axios";
import { ENV } from "@/src/config/env";

type AuthHandlers = {
  getAccessToken(): string | null;
  refreshTokens(): Promise<string>;
  logout(): Promise<void>;
};

export const api = create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

let auth: AuthHandlers | null = null;
let refreshPromise: Promise<string> | null = null;

export function configureHttpAuth(handlers: AuthHandlers) {
  auth = handlers;
}

api.interceptors.request.use((config) => {
  const token = auth?.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!request || error.response?.status !== 401 || request._retry || !auth) {
      throw error;
    }

    request._retry = true;

    try {
      refreshPromise ??= auth.refreshTokens();
      const token = await refreshPromise;

      request.headers.Authorization = `Bearer ${token}`;
      return api(request);
    } catch (refreshError) {
      await auth.logout();
      throw refreshError;
    } finally {
      refreshPromise = null;
    }
  },
);
