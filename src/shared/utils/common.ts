import { isAxiosError } from "axios";
import { ApiError } from "../http/requests";

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

export const formatAmount = (value: number | string) => {
  return new Intl.NumberFormat("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
};

export const formatCurrency = (value: number | string, symbol: string) => {
  return `${symbol} ${formatAmount(value)}`.trim();
};

export function getApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response?.data) {
    const d = error.response.data as Record<string, unknown>;
    return {
      code: (d.code as number) ?? (d.status as number) ?? 500,
      message: (d.message as string) ?? (d.title as string) ?? "Ocurrió un error inesperado.",
    };
  }

  return {
    code: 500,
    message: "Ocurrió un error inesperado.",
  };
}