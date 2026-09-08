import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HorizonAvatar, HorizonBadge, HorizonButton, HorizonDivider, HorizonInput, HorizonSurface, HorizonTextarea } from "./index";

describe("Horizon primitives", () => {
  it("renders accessible form and surface primitives", () => {
    const html = renderToStaticMarkup(<HorizonSurface><HorizonBadge>Source</HorizonBadge><HorizonInput aria-label="Name" /><HorizonTextarea aria-label="Résumé" /><HorizonButton>Save</HorizonButton><HorizonDivider /><HorizonAvatar name="Opti User" /></HorizonSurface>);
    expect(html).toContain("Save");
    expect(html).toContain('aria-label="Name"');
    expect(html).toContain('aria-label="Résumé"');
    expect(html).toContain("OU");
  });
});
