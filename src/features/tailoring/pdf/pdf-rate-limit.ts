const WINDOW_MS = 60_000;
const MAX_DOWNLOADS = 5;

export const PDF_RATE_LIMIT_MESSAGE = "Too many downloads. Please wait a moment and try again.";

type Bucket = { timestamps: number[] };

const globalStore = globalThis as typeof globalThis & {
  __optiPdfRateLimit?: Map<string, Bucket>;
};

const buckets = globalStore.__optiPdfRateLimit ?? new Map<string, Bucket>();
globalStore.__optiPdfRateLimit = buckets;

export function pdfClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export function resetPdfRateLimit(): void {
  buckets.clear();
}

export function consumePdfDownload(
  key: string,
  now = Date.now(),
): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const fresh = (buckets.get(key)?.timestamps ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (fresh.length >= MAX_DOWNLOADS) {
    buckets.set(key, { timestamps: fresh });
    const oldest = fresh[0] ?? now;
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)) };
  }
  fresh.push(now);
  buckets.set(key, { timestamps: fresh });
  return { ok: true };
}
