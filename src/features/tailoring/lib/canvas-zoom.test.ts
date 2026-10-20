import { describe, expect, it } from "vitest";

import {
  fitScale,
  MAX_SCALE,
  MIN_FIT_SCALE,
  MIN_SCALE,
  resolveScale,
  zoomInFrom,
  zoomOutFrom,
  zoomPercent,
} from "./canvas-zoom";

describe("canvas zoom", () => {
  it("fits the sheet to the available width", () => {
    expect(fitScale(408, 816)).toBe(0.5);
    expect(fitScale(612, 816)).toBe(0.75);
  });

  it("renders at 100% before the pane is measured", () => {
    expect(fitScale(0, 816)).toBe(1);
  });

  it("fits a phone-width pane below the smallest manual step", () => {
    expect(fitScale(326, 816)).toBeCloseTo(0.4);
    expect(zoomOutFrom(fitScale(326, 816))).toBeNull();
  });

  it("clamps the fit scale to its range", () => {
    expect(fitScale(100, 816)).toBe(MIN_FIT_SCALE);
    expect(fitScale(5000, 816)).toBe(MAX_SCALE);
  });

  it("keeps manual zoom at or above the smallest step", () => {
    expect(resolveScale(10, 816, 816)).toBe(MIN_SCALE);
  });

  it("uses a fixed percentage outside fit mode", () => {
    expect(resolveScale(100, 400, 816)).toBe(1);
    expect(resolveScale(125, 400, 816)).toBe(1.25);
    expect(resolveScale("fit", 408, 816)).toBe(0.5);
  });

  it("steps from an in-between fit scale to the neighbouring fixed steps", () => {
    const scale = 0.83;
    expect(zoomPercent(scale)).toBe(83);
    expect(zoomInFrom(scale)).toBe(90);
    expect(zoomOutFrom(scale)).toBe(80);
  });

  it("stops at the ends of the range", () => {
    expect(zoomInFrom(MAX_SCALE)).toBeNull();
    expect(zoomOutFrom(MIN_SCALE)).toBeNull();
  });
});
