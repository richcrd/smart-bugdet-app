import { api } from "./client";

export type ApiResponse<T> = {
  code: number;
  message: string;
  response: T;
};

export type ApiError = {
  code: number;
  message: string;
  response?: unknown;
}

export const http = {
  get: <T>(url: string) => {
    return api.get<ApiResponse<T>>(url).then((r) => r.data)
  },

  post: <T>(url: string, body?: unknown) => {
    return api.post<ApiResponse<T>>(url, body).then((r) => r.data)
  },

  put: <T>(url: string, body?: unknown) => {
    return api.put<ApiResponse<T>>(url, body).then((r) => r.data)
  },

  patch: <T>(url: string, body?: unknown) => {
    return api.patch<ApiResponse<T>>(url, body).then((r) => r.data)
  },

  delete: <T>(url: string) => {
    return api.delete<ApiResponse<T>>(url).then((r) => r.data)
  }
}
