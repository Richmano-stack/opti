"use client";

import { useState } from "react";

import { devSampleInputSchema, type DevSampleInput } from "@/features/devtools/lib/sample-inputs";

let sampleRequest: Promise<DevSampleInput> | null = null;

function loadSample(): Promise<DevSampleInput> {
  if (!sampleRequest) {
    sampleRequest = fetch("/api/dev/sample-inputs")
      .then(async (response) => {
        if (!response.ok) throw new Error("Sample documents are unavailable.");
        return devSampleInputSchema.parse(await response.json());
      })
      .catch((error: unknown) => {
        sampleRequest = null;
        throw error;
      });
  }

  return sampleRequest;
}

export function DevSampleFill({
  disabled = false,
  onFill,
}: {
  disabled?: boolean;
  onFill: (sample: DevSampleInput) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!process.env.NODE_ENV || process.env.NODE_ENV !== "development") return null;

  const fill = async () => {
    setError(null);
    setIsLoading(true);

    try {
      onFill(await loadSample());
    } catch {
      setError("Sample documents could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={fill}
        disabled={disabled || isLoading}
        className="text-xs font-semibold text-horizon-secondary underline-offset-2 hover:underline disabled:opacity-50"
      >
        {isLoading ? "Filling sample…" : "Fill sample"}
      </button>
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </span>
  );
}
