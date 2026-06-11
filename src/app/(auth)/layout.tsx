import { Toaster } from "sonner";

export default function AuthLayout({
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
