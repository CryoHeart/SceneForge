import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-4xl font-black">404</h1>
      <p className="text-zinc-400">The page you requested was not found.</p>
      <Link to="/" className="text-accent hover:text-red-300">
        Return home
      </Link>
    </div>
  );
}
