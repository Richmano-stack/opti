import { beforeEach, describe, expect, it, vi } from "vitest";

const { success, error, info } = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { success, error, info } }));

import { showHorizonToast } from "./horizon-toast";

describe("showHorizonToast", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses the explicit success toast pattern", () => {
    showHorizonToast({ tone: "success", title: "Résumé saved", description: "Your source document is up to date." });
    expect(success).toHaveBeenCalledWith("Résumé saved", { description: "Your source document is up to date." });
  });

  it("uses the explicit error toast pattern", () => {
    showHorizonToast({ tone: "error", title: "Save failed" });
    expect(error).toHaveBeenCalledWith("Save failed", { description: undefined });
  });
});
