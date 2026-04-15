export const API_BASE = process.env.NEXT_PUBLIC_USE_DOTNET_BACKEND === "true" ? "/api-proxy" : "/api";

export function apiUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}
