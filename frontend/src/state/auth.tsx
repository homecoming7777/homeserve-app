import React, { createContext, useContext, useMemo, useState } from 'react';
import type { AuthPayload } from '../lib/storage';
import { getAuth, setAuth } from '../lib/storage';
import * as authApi from '../api/auth';

type AuthContextValue = {
  auth: AuthPayload | null;
  role: 'client' | 'provider' | 'admin' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: authApi.RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  setAuthDirect: (payload: AuthPayload | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = useState<AuthPayload | null>(() => getAuth());

  const value = useMemo<AuthContextValue>(() => {
    const setAuthDirect = (payload: AuthPayload | null) => {
      setAuthState(payload);
      setAuth(payload);
    };

    return {
      auth,
      role: auth?.user.role ?? null,
      async login(email: string, password: string) {
        const payload = await authApi.login({ email, password });
        setAuthDirect(payload);
      },
      async register(input: authApi.RegisterInput) {
        const payload = await authApi.register(input);
        setAuthDirect(payload);
      },
      async logout() {
        try {
          await authApi.logout();
        } finally {
          setAuthDirect(null);
        }
      },
      async refreshMe() {
        if (!auth) return;
        const me = await authApi.me();
        setAuthDirect({ ...auth, user: me.user });
      },
      setAuthDirect,
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

