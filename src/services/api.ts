const API_BASE_URL = "https://example.com/api";

export function buildApiUrl(path: string) {
  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");

  return `${normalizedBase}/${normalizedPath}`;
}

export { API_BASE_URL };

