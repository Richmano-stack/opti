import { afterEach, describe, expect, it, vi } from "vitest";

import { authLinkEmail, sendTransactionalEmail } from "./send-transactional-email";

describe("authLinkEmail", () => {
  it("escapes markup in the heading and the link", () => {
    const { html, text } = authLinkEmail({
      heading: "Verify <b>",
      body: "Open the link",
      action: "Verify email",
      url: "https://opti.example/verify?token=a&b=1",
    });

    expect(html).toContain("Verify &lt;b&gt;");
    expect(html).toContain("https://opti.example/verify?token=a&amp;b=1");
    expect(html).not.toContain("<b>");
    expect(text).toContain("https://opti.example/verify?token=a&b=1");
  });
});

describe("sendTransactionalEmail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM;
  });

  it("posts the message to Resend with the configured from address", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM = "Opti <mail@opti.example>";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "email_123" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await sendTransactionalEmail({
      to: "person@example.com",
      subject: "Verify your Opti email",
      text: "Verify",
      html: "<p>Verify</p>",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_test_key",
          "Content-Type": "application/json",
        }),
      }),
    );
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(init.body)) as {
      from: string;
      to: string[];
      subject: string;
    };
    expect(body.from).toBe("Opti <mail@opti.example>");
    expect(body.to).toEqual(["person@example.com"]);
    expect(body.subject).toBe("Verify your Opti email");
  });

  it("trims a trailing newline from the Resend key and from address", async () => {
    process.env.RESEND_API_KEY = "re_test_key\n";
    process.env.RESEND_FROM = "Opti <mail@opti.example>\r\n";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "email_123" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await sendTransactionalEmail({
      to: "person@example.com",
      subject: "Verify",
      text: "text",
      html: "<p>html</p>",
    });

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.get("authorization")).toBe("Bearer re_test_key");
    const body = JSON.parse(String(init.body)) as { from: string };
    expect(body.from).toBe("Opti <mail@opti.example>");
  });

  it("rejects a failed send without logging the API key", async () => {
    process.env.RESEND_API_KEY = "re_secret_key";
    process.env.RESEND_FROM = "Opti <mail@opti.example>";
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ message: "invalid" }),
      }),
    );

    await expect(
      sendTransactionalEmail({
        to: "person@example.com",
        subject: "Verify",
        text: "text",
        html: "<p>html</p>",
      }),
    ).rejects.toThrow("Email could not be sent.");

    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain("re_secret_key");
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain("person@example.com");
  });
});
