export type ApiResponse<T> = {
  code: number;
  message: string;
  response: T;
};

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== "object") return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.code === "number" &&
    typeof v.message === "string" &&
    "response" in v
  );
}

export function unwrap<T>(value: ApiResponse<T>): T {
  return value.response;
}
