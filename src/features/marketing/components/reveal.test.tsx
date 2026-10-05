import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Reveal } from "./reveal";

describe("Reveal", () => {
  it("renders children for progressive enhancement", () => {
    const html = renderToStaticMarkup(
      <Reveal delayMs={120}>
        <p>Visible content</p>
      </Reveal>,
    );

    expect(html).toContain("Visible content");
    expect(html).toContain("horizon-reveal");
    expect(html).toContain("--horizon-delay:120ms");
  });
});
