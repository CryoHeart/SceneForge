import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/events", label: "Events" },
  { to: "/bands", label: "Bands" },
  { to: "/venues", label: "Venues" },
  { to: "/posters", label: "Posters" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/65 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-black tracking-wide text-zinc-100" onClick={closeMenu}>
          Scene<span className="text-accent">Forge</span>
        </Link>

        <button
          type="button"
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          Menu
        </button>

        <div className="hidden items-center gap-4 text-sm md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                `rounded-md px-2 py-1 transition ${isActive ? "bg-zinc-900 text-accent" : "text-zinc-300 hover:text-zinc-100"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Login
          </Link>
        </div>
      </nav>

      {isOpen ? (
        <div className="border-t border-zinc-800/70 bg-zinc-950/90 px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }: { isActive: boolean }) =>
                  `rounded-lg px-3 py-2 transition ${isActive ? "bg-zinc-900 text-accent" : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-1 rounded-lg border border-zinc-700 px-3 py-2 text-zinc-200 transition hover:border-zinc-500"
            >
              Login
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
