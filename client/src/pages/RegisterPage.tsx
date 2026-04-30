import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: "fan" }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Registration failed");
      }

      const data = (await response.json()) as { token: string; user: unknown };
      localStorage.setItem("sceneforge_token", data.token);
      localStorage.setItem("sceneforge_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to register");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-panel/95 p-6 shadow-purpleGlow md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-accentAlt/90">Join the scene</p>
      <h1 className="mt-1 text-3xl font-black">Register</h1>
      <p className="mt-2 text-sm text-zinc-400">Create your SceneForge account and start tracking local shows.</p>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <FormInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <FormInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <FormInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button className="w-full" type="submit">
          Create account
        </Button>
      </form>
      <p className="mt-4 text-sm text-zinc-400">
        Already have one?{" "}
        <Link to="/login" className="font-semibold text-accent transition hover:text-red-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
