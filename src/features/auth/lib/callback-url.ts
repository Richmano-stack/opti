export const ACCOUNT_HOME = "/dashboard/generator";

export function getSafeCallbackUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return ACCOUNT_HOME;
  return value;
}
