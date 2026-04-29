import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/bands", label: "Bands" },
  { to: "/venues", label: "Venues" },
  { to: "/posters", label: "Poster Wall" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-3xl tracking-wider text-white" onClick={closeMenu}>
          Scene<span className="text-scene-accent">Forge</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-2 py-1 text-sm transition ${
                  isActive
                    ? "bg-rose-400/20 text-white shadow-[inset_0_0_0_1px_rgba(251,113,133,0.4)]"
                    : "text-white/60 hover:text-white"
                }`
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/5">
            Login
          </Link>
          <Link to="/register" className="rounded-lg bg-scene-accent px-3 py-1.5 text-sm text-white hover:bg-rose-500">
            Join
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="text-lg">{isMenuOpen ? "x" : "="}</span>
        </button>
      </div>
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-black/85 px-4 py-4 md:hidden">
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${
                    isActive ? "bg-rose-400/20 text-white" : "text-white/70 hover:bg-white/5"
                  }`
                }
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg border border-white/15 px-3 py-2 text-center text-sm text-white/85"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-lg bg-scene-accent px-3 py-2 text-center text-sm text-white"
            >
              Join
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
