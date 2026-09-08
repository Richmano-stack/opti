const DEFAULT_CALLBACK = "/dashboard";

export function getSafeCallbackUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return DEFAULT_CALLBACK;
  return value;
}
