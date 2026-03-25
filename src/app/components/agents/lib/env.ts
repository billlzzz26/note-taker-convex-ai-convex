export function getEnvVar(key: string): string {
  if (typeof window !== "undefined" && key.startsWith("NEXT_PUBLIC_")) {
    return process.env[key] || "";
  }
  return process.env[key] || process.env[key.replace(/^NEXT_PUBLIC_/, "")] || "";
}

export const KILO_API_KEY = getEnvVar("KILO_API_KEY");
export const CONVEX_URL = getEnvVar("CONVEX_URL") || getEnvVar("NEXT_PUBLIC_CONVEX_URL");
