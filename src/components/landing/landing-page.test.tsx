import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { LandingPage } from "./landing-page";

const mockGetServerSession = vi.fn().mockResolvedValue(null);
vi.mock("@/server/auth/session", () => ({ getServerSession: () => mockGetServerSession() }));

describe("LandingPage", () => {
  it("presents the Horizon landing experience with truthful product paths for guests", async () => {
    mockGetServerSession.mockResolvedValueOnce(null);
    const html = renderToStaticMarkup(await LandingPage());

    expect(html).not.toContain('href="#"');
    expect(html).not.toContain("4.9/5");
    expect(html).not.toContain("Loved by job seekers");
    expect(html).not.toContain("Pricing");
    expect(html).not.toContain("Resources");
    expect(html).toContain("One resume. Every opportunity, in focus.");
    expect(html).toContain('href="/try"');
    expect(html).toContain('href="/login"');
    expect(html).toContain('href="/signup"');
    expect(html).toContain("Log in");
    expect(html).toContain("Sign up");
    expect(html).toContain("Try it free");
    expect(html).toContain('aria-label="Opti home"');
    expect(html).toContain("Nothing from guest sessions is saved");
    expect(html).toContain("Built around your real experience");
    expect(html).toContain("Make the next application feel like yours.");
    expect(html).toContain("Privacy boundary");
  });

  it("presents a Go to Dashboard CTA in the navbar when user is authenticated", async () => {
    mockGetServerSession.mockResolvedValueOnce({
      user: { id: "u-1", email: "user@example.com", name: "User" },
    });
    const html = renderToStaticMarkup(await LandingPage());

    expect(html).toContain('href="/dashboard"');
    expect(html).toContain("Go to Dashboard");
  });
});
