import { Toaster } from "sonner";

export default function GeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster richColors closeButton position="top-center" />
    </>
  );
}

