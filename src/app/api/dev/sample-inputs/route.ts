import { NextResponse } from "next/server";

import { loadDevSampleInputs } from "@/features/devtools/lib/load-sample-inputs";
import { isDevelopmentRuntime } from "@/features/devtools/lib/sample-inputs";

export async function GET() {
  if (!isDevelopmentRuntime()) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(await loadDevSampleInputs());
}
