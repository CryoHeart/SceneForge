import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    auth.login({
      token: "demo-token",
      user: {
        id: 1,
        email: "fan@sceneforge.dev",
        displayName: "Riff Hunter",
        role: "fan",
      },
    });
    navigate("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-scene-800 p-6 shadow-panel">
      <h1 className="font-display text-4xl text-white">Login</h1>
      <form onSubmit={handleLogin} className="mt-5 space-y-4">
        <FormInput id="login-email" label="Email" type="email" required placeholder="fan@sceneforge.dev" />
        <FormInput id="login-password" label="Password" type="password" required placeholder="password123" />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
      <p className="mt-4 text-sm text-white/65">
        No account? <Link to="/register" className="text-fuchsia-200">Create one</Link>
      </p>
    </div>
  );
}
