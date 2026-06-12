import Link from "next/link";

type AppShellProps = {
  children: React.ReactNode;
  header?: "minimal" | "none";
};

export function AppShell({ children, header = "minimal" }: AppShellProps) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      <div aria-hidden className="ambient-glow">
        <div className="absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[320px] w-[420px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      {header === "minimal" ? (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-bold text-foreground">
              Opti
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-brand h-9 px-5 text-sm">
                Get started
              </Link>
            </div>
          </nav>
        </header>
      ) : null}

      {children}
    </div>
  );
}
