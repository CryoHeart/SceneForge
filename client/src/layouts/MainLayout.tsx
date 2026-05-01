import type { PropsWithChildren } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

const roleLabel: Record<string, string> = {
  fan: "Fan",
  band_admin: "Band Admin",
  venue_admin: "Venue Admin",
  admin: "Admin",
};

export function MainLayout({ children }: PropsWithChildren) {
  const auth = useAuth();

  return (
    <div className="site-shell min-h-screen bg-noise font-body text-white">
      <Navbar />
      {auth.isAuthenticated && auth.user && (
        <div className="border-b border-white/5 bg-gradient-to-r from-rose-950/40 via-black/30 to-black/10">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
            <span className="text-sm text-white/90">
              Welcome back, <span className="font-semibold text-white">{auth.user.displayName}</span>
            </span>
            <span className="h-3.5 w-px bg-white/20" />
            <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-medium text-rose-200">
              {roleLabel[auth.user.role] ?? auth.user.role}
            </span>
          </div>
        </div>
      )}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <Footer />
    </div>
  );
}
