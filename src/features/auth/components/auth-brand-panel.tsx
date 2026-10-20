import { BrandMark } from "@/components/brand-mark"

export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col items-center justify-center gap-4 bg-muted p-10 text-center md:flex">
      <BrandMark className="[&_svg]:size-20 [&>span]:text-6xl" />
      <p className="max-w-56 text-sm text-muted-foreground">
        Tailor your résumé to every role in minutes.
      </p>
    </div>
  )
}
