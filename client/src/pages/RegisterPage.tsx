import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";

export function RegisterPage() {
  const navigate = useNavigate();

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/login");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-scene-800 p-6 shadow-panel">
      <h1 className="font-display text-4xl text-white">Register</h1>
      <form onSubmit={handleRegister} className="mt-5 space-y-4">
        <FormInput id="reg-name" label="Display Name" required placeholder="Your scene name" />
        <FormInput id="reg-email" label="Email" type="email" required placeholder="you@example.com" />
        <FormInput id="reg-password" label="Password" type="password" required placeholder="Create a password" />
        <Button type="submit" className="w-full">Create Account</Button>
      </form>
      <p className="mt-4 text-sm text-white/65">
        Already registered? <Link to="/login" className="text-fuchsia-200">Login</Link>
      </p>
    </div>
  );
}
