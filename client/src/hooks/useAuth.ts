import { useMemo, useState } from "react";
import type { User } from "../types";

type AuthState = {
  token: string | null;
  user: User | null;
};

const storageKey = "sceneforge_auth";

function readAuthState(): AuthState {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return { token: null, user: null };
  }

  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return { token: null, user: null };
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => readAuthState());

  const isAuthenticated = useMemo(() => Boolean(state.token), [state.token]);

  function login(nextState: AuthState) {
    setState(nextState);
    localStorage.setItem(storageKey, JSON.stringify(nextState));
  }

  function logout() {
    setState({ token: null, user: null });
    localStorage.removeItem(storageKey);
  }

  return {
    ...state,
    isAuthenticated,
    login,
    logout,
  };
}
