/** Keep cleanup failures from replacing the original Playwright failure. */
export async function cleanupPreservingTestFailure(
  cleanup: () => Promise<void>,
  close: () => Promise<void>,
  testFailure: unknown,
): Promise<void> {
  let cleanupFailure: unknown;
  let closeFailure: unknown;

  try {
    await cleanup();
  } catch (error: unknown) {
    cleanupFailure = error;
  }

  try {
    await close();
  } catch (error: unknown) {
    closeFailure = error;
  }

  if (testFailure !== undefined) {
    if (cleanupFailure !== undefined) {
      console.error("[e2e] Test account cleanup also failed:", cleanupFailure);
    }
    if (closeFailure !== undefined) {
      console.error("[e2e] Database client shutdown also failed:", closeFailure);
    }
    return;
  }

  if (cleanupFailure !== undefined) throw cleanupFailure;
  if (closeFailure !== undefined) throw closeFailure;
}
