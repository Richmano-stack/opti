import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Ambient glow — decorative only */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[320px] w-[420px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full">
        {children}
      </div>

      <Toaster richColors closeButton position="top-center" />
    </div>
  );
}
