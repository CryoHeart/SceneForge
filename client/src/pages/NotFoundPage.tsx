import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-scene-800 p-8 text-center">
      <h1 className="font-display text-5xl text-white">404</h1>
      <p className="mt-2 text-white/70">The page you are looking for is off the map.</p>
      <Link to="/" className="mt-5 inline-block rounded-xl bg-scene-accent px-4 py-2 text-sm text-white hover:bg-rose-500">
        Return Home
      </Link>
    </div>
  );
}
