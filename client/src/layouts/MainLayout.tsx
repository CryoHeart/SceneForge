import type { PropsWithChildren } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="site-shell min-h-screen bg-noise font-body text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <Footer />
    </div>
  );
}
