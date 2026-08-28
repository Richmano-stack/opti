import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import styles from "./sky-theme.module.css";

type SkyThemeProps = ComponentProps<"div">;

/**
 * Applies Opti's light, sky-blue semantic tokens to a product surface.
 * All shadcn components rendered beneath this boundary inherit the theme.
 */
export function SkyTheme({ className, ...props }: SkyThemeProps) {
  return <div className={cn(styles.theme, className)} {...props} />;
}
