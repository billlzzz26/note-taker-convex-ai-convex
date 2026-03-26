export function getEnvVar(key: string): string {
  if (typeof window !== "undefined" && key.startsWith("NEXT_PUBLIC_")) {
    return process.env[key] || "";
  }
  return process.env[key] || process.env[key.replace(/^NEXT_PUBLIC_/, "")] || "";
}

export const KILO_API_KEY = getEnvVar("KILO_API_KEY");

const rawConvexUrl =
  getEnvVar("CONVEX_URL") || getEnvVar("NEXT_PUBLIC_CONVEX_URL") || "";

function sanitizeBaseUrl(url: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    // Allow only HTTP(S) URLs and strip any path/query/fragment so we keep just the origin.
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.origin;
  } catch {
    // If the URL cannot be parsed, treat it as invalid.
    return "";
  }
}

export const CONVEX_URL = sanitizeBaseUrl(rawConvexUrl);
