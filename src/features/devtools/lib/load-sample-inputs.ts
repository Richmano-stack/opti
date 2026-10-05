import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { devSampleInputSchema, type DevSampleInput } from "./sample-inputs";

export async function loadDevSampleInputs(): Promise<DevSampleInput> {
  const directory = join(process.cwd(), "src/features/tailoring/lib/fixtures");
  const [resume, jobDescription] = await Promise.all([
    readFile(join(directory, "sample-resume.txt"), "utf8"),
    readFile(join(directory, "sample-jd.txt"), "utf8"),
  ]);

  return devSampleInputSchema.parse({ resume, jobDescription });
}
