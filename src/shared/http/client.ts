import { createAuthRefresh } from "axios-auth-refresh";
import { AxiosError, create, InternalAxiosRequestConfig } from "axios";
import { ENV } from "@/src/config/env";

type AuthHandlers = {
  getAccessToken(): string | null;
  refreshSession(): Promise<string>;
  onLogout(): Promise<void>;
};

export const api = create({
  baseURL: ENV.API_BASE_URL,
  headers: { Accept: "application/json" },
  timeout: 15_000,
});

let auth: AuthHandlers | null = null;

export function configureHttpAuth(handlers: AuthHandlers) {
  auth = handlers;
}

const PUBLIC_PATHS = ["/service/auth/login", "/service/auth/register"];

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_PATHS.some((path) => config.url?.startsWith(path));
  const token = auth?.getAccessToken();

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => {
    if (__DEV__) {
      console.log(`<- ${response.config.method?.toUpperCase()} ${response.status} ${response.config.baseURL || ""}${response.config.url || ""}`);
    }
    return response;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.log(`<- ${error.response?.status || 0} ${error.config?.baseURL || ""}${error.config?.url || ""}`);
    }
    return Promise.reject(error);
  },
);

createAuthRefresh(api, async () => {
    const currentAuth = auth!;

    try {
      await currentAuth.refreshSession();
    } catch {
      await currentAuth.onLogout();
      throw new Error("Tu sesión expiró. Por favor inicia sesión nuevamente.");
    }
  },
  {
    shouldRefresh: (error: AxiosError) => {
      if (auth === null) return false;
      if (error.response?.status !== 401) return false;

      const url = error.config?.url || "";
      const isPublicRoute = PUBLIC_PATHS.some((path) => url.startsWith(path));

      return !isPublicRoute;
    },

    onRetry: (requestConfig: InternalAxiosRequestConfig) => {
      const newToken = auth?.getAccessToken();

      if (newToken) {
        requestConfig.headers["Authorization"] = `Bearer ${newToken}`;
      }

      return requestConfig;
    },

    deduplicateRefresh: true,
  },
);
