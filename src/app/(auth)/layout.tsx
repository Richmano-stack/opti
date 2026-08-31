import Link from "next/link";
import { Toaster } from "sonner";

function OptiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 text-brand-ink"
        aria-hidden="true"
      >
        <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900">Opti</span>
    </div>
  );
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-sky-gradient relative flex min-h-svh flex-col items-center justify-center text-slate-900 p-4 sm:p-6">
      {/* Ambient glow */}
      <div aria-hidden className="ambient-glow">
        <div className="absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-brand-soft/35 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-[320px] w-[420px] rounded-full bg-brand-soft/25 blur-[80px]" />
      </div>

      <div className="mb-6">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <OptiLogo />
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      <Toaster richColors closeButton position="top-center" />
    </div>
  );
}
