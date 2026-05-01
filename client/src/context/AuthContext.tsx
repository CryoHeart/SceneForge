import { createContext, useMemo, useState, type PropsWithChildren } from "react";
import type { User } from "../types";

type AuthState = {
  token: string | null;
  user: User | null;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  login: (next: AuthState) => void;
  logout: () => void;
};

const storageKey = "sceneforge_auth";

function readAuthState(): AuthState {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return { token: null, user: null };
  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return { token: null, user: null };
  }
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(() => readAuthState());

  const isAuthenticated = useMemo(() => Boolean(state.token), [state.token]);

  function login(next: AuthState) {
    setState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function logout() {
    setState({ token: null, user: null });
    localStorage.removeItem(storageKey);
  }

  const value = useMemo(
    () => ({ ...state, isAuthenticated, login, logout }),
    [state, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
