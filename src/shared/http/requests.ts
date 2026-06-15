import type { AxiosRequestConfig } from "axios";
import { api } from "./client";
import { unwrap, type ApiResponse } from "./types";

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await api.get<ApiResponse<T>>(url, config);
  return unwrap(data);
}

export async function post<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const { data } = await api.post<ApiResponse<TResponse>>(url, body, config);
  return unwrap(data);
}
