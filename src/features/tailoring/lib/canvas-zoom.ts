export const ZOOM_STEPS = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200] as const;

export const MIN_SCALE = ZOOM_STEPS[0] / 100;
export const MAX_SCALE = ZOOM_STEPS[ZOOM_STEPS.length - 1] / 100;
/** Fit may go below the smallest step so a phone-width pane still shows the whole sheet. */
export const MIN_FIT_SCALE = 0.25;

/** "fit" follows the pane width; a number is a fixed percentage. */
export type ZoomMode = "fit" | number;

function clampScale(scale: number, min = MIN_SCALE): number {
  return Math.min(MAX_SCALE, Math.max(min, scale));
}

/** Scale that makes a sheet of `sheetWidth` fill `availableWidth`. Unmeasured panes render at 100%. */
export function fitScale(availableWidth: number, sheetWidth: number): number {
  if (availableWidth <= 0 || sheetWidth <= 0) return 1;
  return clampScale(availableWidth / sheetWidth, MIN_FIT_SCALE);
}

export function resolveScale(mode: ZoomMode, availableWidth: number, sheetWidth: number): number {
  return mode === "fit" ? fitScale(availableWidth, sheetWidth) : clampScale(mode / 100);
}

export function zoomPercent(scale: number): number {
  return Math.round(scale * 100);
}

/** Next fixed step above the current scale, or null at the maximum. */
export function zoomInFrom(scale: number): number | null {
  const current = zoomPercent(scale);
  return ZOOM_STEPS.find((step) => step > current) ?? null;
}

/** Next fixed step below the current scale, or null at the minimum. */
export function zoomOutFrom(scale: number): number | null {
  const current = zoomPercent(scale);
  return [...ZOOM_STEPS].reverse().find((step) => step < current) ?? null;
}
