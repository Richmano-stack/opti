import Link from "next/link";

const NAV_LINKS = [
  { label: "Why Opti", href: "#benefits" },
  { label: "How it works", href: "#how-it-works" },
];

export function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-foreground">
          Opti
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline">
            Log in
          </Link>
          <Link href="/signup" className="btn-brand h-9 px-5 text-sm">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}