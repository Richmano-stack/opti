import type { CSSProperties } from "react";

const WEB_PX_PER_INCH = 96;
const PDF_PT_PER_INCH = 72;

export type PageFormat = "letter" | "a4";
export type TemplateDensity = "regular" | "compact";

type PageInch = {
  width: number;
  height: number;
  margin: number;
};

const pages: Record<PageFormat, PageInch> = {
  letter: { width: 8.5, height: 11, margin: 0.6 },
  a4: { width: 8.27, height: 11.69, margin: 0.6 },
};

/** Shared spacing in CSS pixels. PDF points are the same ratios at 72pt per inch. */
const spacePx = {
  section: 20,
  entry: 12,
  bullet: 4,
} as const;

export const templateTheme = {
  font: {
    display: 'Georgia, "Times New Roman", serif',
    body: '"Segoe UI", Calibri, sans-serif',
  },
  color: {
    ink: "#1c1c1c",
    muted: "#5f5f5f",
    accent: "#b42907",
    accentInk: "#ffffff",
    rule: "#1c1c1c",
    paper: "#ffffff",
  },
  space: spacePx,
  page: pages,
} as const;

export function pageBox(format: PageFormat, unit: "px" | "pt") {
  const perInch = unit === "px" ? WEB_PX_PER_INCH : PDF_PT_PER_INCH;
  const page = templateTheme.page[format];
  const margin = Math.round(page.margin * perInch);
  return {
    width: Math.round(page.width * perInch),
    height: Math.round(page.height * perInch),
    margin,
  };
}

export function spaceFor(density: TemplateDensity, unit: "px" | "pt") {
  const scale = density === "compact" ? 0.8 : 1;
  const toUnit = (px: number) => Math.round((px * scale * (unit === "pt" ? PDF_PT_PER_INCH : WEB_PX_PER_INCH)) / WEB_PX_PER_INCH);
  return {
    section: toUnit(templateTheme.space.section),
    entry: toUnit(templateTheme.space.entry),
    bullet: toUnit(templateTheme.space.bullet),
  };
}

export function themeStyle(density: TemplateDensity, format: PageFormat = "letter"): CSSProperties {
  const space = spaceFor(density, "px");
  const page = pageBox(format, "px");
  return {
    "--resume-ink": templateTheme.color.ink,
    "--resume-muted": templateTheme.color.muted,
    "--resume-accent": templateTheme.color.accent,
    "--resume-accent-ink": templateTheme.color.accentInk,
    "--resume-rule": templateTheme.color.rule,
    "--resume-paper": templateTheme.color.paper,
    "--resume-section": `${space.section}px`,
    "--resume-entry": `${space.entry}px`,
    "--resume-bullet": `${space.bullet}px`,
    "--resume-margin": `${page.margin}px`,
    "--resume-display": templateTheme.font.display,
    "--resume-body": templateTheme.font.body,
    width: "100%",
    maxWidth: page.width,
    fontFamily: "var(--resume-body)",
    color: "var(--resume-ink)",
    backgroundColor: "var(--resume-paper)",
  } as CSSProperties;
}
