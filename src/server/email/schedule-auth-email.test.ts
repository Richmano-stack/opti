import { afterEach, describe, expect, it, vi } from "vitest";

const afterTasks: Array<() => unknown> = [];

vi.mock("next/server", () => ({
  after: (task: () => unknown) => {
    afterTasks.push(task);
  },
}));

vi.mock("./send-transactional-email", () => ({
  authLinkEmail: () => ({ text: "text", html: "<p>text</p>" }),
  sendTransactionalEmail: vi.fn(),
}));

import { scheduleAuthEmail } from "./schedule-auth-email";
import { sendTransactionalEmail } from "./send-transactional-email";

describe("scheduleAuthEmail", () => {
  afterEach(() => {
    afterTasks.length = 0;
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("returns the Resend promise from after()", async () => {
    vi.mocked(sendTransactionalEmail).mockResolvedValue(undefined);
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    scheduleAuthEmail({
      kind: "verify",
      to: "person@example.com",
      url: "https://opti.example/verify",
    });

    expect(afterTasks).toHaveLength(1);
    const pending = afterTasks[0]?.();
    expect(pending).toBeInstanceOf(Promise);
    await pending;

    expect(sendTransactionalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "person@example.com",
        subject: "Verify your Opti email",
      }),
    );
    expect(JSON.stringify(infoSpy.mock.calls)).toContain("verify");
    expect(JSON.stringify(infoSpy.mock.calls)).not.toContain("person@example.com");
  });

  it("logs a failed send without the recipient and still resolves", async () => {
    vi.mocked(sendTransactionalEmail).mockRejectedValue(Object.assign(new TypeError("fetch failed"), { cause: { code: "ENOTFOUND" } }));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    scheduleAuthEmail({
      kind: "verify",
      to: "person@example.com",
      url: "https://opti.example/verify",
    });

    await expect(afterTasks[0]?.()).resolves.toBeUndefined();
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain("fetch failed");
    expect(logged).toContain("ENOTFOUND");
    expect(logged).not.toContain("person@example.com");
  });
});
