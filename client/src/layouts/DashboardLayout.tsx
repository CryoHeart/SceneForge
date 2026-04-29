import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

const sections = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/events", label: "Events" },
  { to: "/dashboard/manage", label: "Manage Profiles" },
  { to: "/dashboard/upload", label: "Upload Poster" },
];

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-white/10 bg-scene-800/85 p-4 shadow-panel lg:sticky lg:top-24 lg:h-fit">
        <h2 className="mb-4 text-lg font-semibold text-white">Dashboard</h2>
        <div className="space-y-2">
          {sections.map((section) => (
            <NavLink
              key={section.to}
              to={section.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white"
                    : "text-white/70 hover:bg-white/5"
                }`
              }
            >
              {section.label}
            </NavLink>
          ))}
        </div>
      </aside>
      <section className="rounded-2xl border border-white/10 bg-scene-800/85 p-5 shadow-panel sm:p-6">{children}</section>
    </div>
  );
}
