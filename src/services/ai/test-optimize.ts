/**
 * End-to-end test for the Gemini resume optimization pipeline.
 *
 * Prerequisites:
 *   npm install @google/generative-ai zod tsx
 *   Set GEMINI_API_KEY (or GOOGLE_GENERATIVE_AI_API_KEY) in your environment
 *
 * Run from project root:
 *   npx tsx src/services/ai/test-optimize.ts
 *
 * Windows PowerShell:
 *   $env:GEMINI_API_KEY="your_key_here"; npx tsx src/services/ai/test-optimize.ts
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  GeminiServiceError,
  InvalidInputError,
  ResumeValidationError,
  optimizeResume,
} from "./index";

const FIXTURES_DIR = join(process.cwd(), "src/services/ai/fixtures");

function loadFixture(filename: string): string {
  return readFileSync(join(FIXTURES_DIR, filename), "utf-8");
}

function formatZodIssues(error: ResumeValidationError): string {
  if (!error.zodError) {
    return error.message;
  }

  return error.zodError.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

async function main(): Promise<void> {
  const resume = loadFixture("sample-resume.txt");
  const jobDescription = loadFixture("sample-jd.txt");

  console.log("Starting resume optimization pipeline...");
  console.log(`  Resume length: ${resume.length} chars`);
  console.log(`  Job description length: ${jobDescription.length} chars\n`);

  const result = await optimizeResume({ resume, jobDescription });

  console.log("Optimization succeeded. Validated structured output:\n");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error: unknown) => {
  if (error instanceof InvalidInputError) {
    console.error(`Input error: ${error.message}`);
    process.exit(1);
  }

  if (error instanceof ResumeValidationError) {
    console.error(`Validation error: ${error.message}`);
    console.error(formatZodIssues(error));
    process.exit(1);
  }

  if (error instanceof GeminiServiceError) {
    console.error(`Gemini service error: ${error.message}`);
    process.exit(1);
  }

  console.error("Unexpected error:", error);
  process.exit(1);
});
