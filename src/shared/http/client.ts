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

const paths = ["/service/auth/login", "/service/auth/register"];

api.interceptors.request.use((config) => {
  const isPublic = paths.some((path) => config.url?.startsWith(path));
  const token = auth?.getAccessToken();

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (__DEV__) {
    const url = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.log(`-> ${config.method?.toUpperCase()} ${url}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      const url = `${response.config.baseURL ?? ""}${response.config.url ?? ""}`;
      console.log(`<- ${response.status} ${url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const request = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (__DEV__) {
      const url = `${request?.baseURL ?? ""}${request?.url ?? ""}`;
      console.log(`<- ${error.response?.status ?? 0} ${url}`);
    }

    if (!request || error.response?.status !== 401 || request._retry || !auth) {
      const message = (error.response?.data as { message?: string })?.message;
      throw message ? new Error(message) : error;
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
