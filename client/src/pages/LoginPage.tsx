import axios from "axios";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/api";

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("login-email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("login-password") as HTMLInputElement).value;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await loginUser(email, password);
      auth.login({ token: result.token, user: result.user });
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Wrong email or password. Please try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-scene-800 p-6 shadow-panel">
      <h1 className="font-display text-4xl text-white">Login</h1>
      <form onSubmit={(e) => { void handleLogin(e); }} className="mt-5 space-y-4">
        <FormInput id="login-email" label="Email" type="email" required placeholder="fan@sceneforge.dev" />
        <FormInput id="login-password" label="Password" type="password" required placeholder="password123" />
        {error && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-white/65">
        No account? <Link to="/register" className="text-fuchsia-200">Create one</Link>
      </p>
    </div>
  );
}
