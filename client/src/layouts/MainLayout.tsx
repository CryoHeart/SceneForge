import type { PropsWithChildren } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#531e1e_0%,transparent_40%),radial-gradient(circle_at_85%_10%,#37204e_0%,transparent_35%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-metal-grid bg-[size:28px_28px] opacity-[0.06]" />
      <Navbar />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">{children}</div>
      <Footer />
    </div>
  );
}
