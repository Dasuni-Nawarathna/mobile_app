import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import type { AuthUser } from '@/types/api';
import { loginRequest, logoutRequest, registerRequest } from '@/lib/api/services/auth';
import { ApiError } from '@/lib/api/client';
import { deleteSessionPayload, getSessionPayload, setSessionPayload } from '@/lib/session-storage';

const STORAGE_KEY = 'yc_mobile_session';

type SessionPayload = { token: string; user: AuthUser };

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

SplashScreen.preventAutoHideAsync().catch(() => {});

async function persistSession(payload: SessionPayload) {
  await setSessionPayload(STORAGE_KEY, JSON.stringify(payload));
}

async function readSession(): Promise<SessionPayload | null> {
  try {
    const raw = await getSessionPayload(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

async function wipeSession() {
  await deleteSessionPayload(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await readSession();
      if (cancelled) return;
      if (session?.token && session?.user) {
        setToken(session.token);
        setUser(session.user);
      }
      setInitializing(false);
      await SplashScreen.hideAsync().catch(() => {});
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      const res = await loginRequest(email, password);
      const payload: SessionPayload = { token: res.token, user: res.user };
      await persistSession(payload);
      setToken(res.token);
      setUser(res.user);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Sign in failed';
      setAuthError(msg);
      throw e;
    }
  }, []);

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      setAuthError(null);
      try {
        const res = await registerRequest(input);
        const payload: SessionPayload = { token: res.token, user: res.user };
        await persistSession(payload);
        setToken(res.token);
        setUser(res.user);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : 'Registration failed';
        setAuthError(msg);
        throw e;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setAuthError(null);
    if (token) {
      try {
        await logoutRequest(token);
      } catch {
        /* best-effort */
      }
    }
    await wipeSession();
    setToken(null);
    setUser(null);
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      initializing,
      signIn,
      signUp,
      signOut,
      authError,
      clearAuthError,
    }),
    [user, token, initializing, signIn, signUp, signOut, authError, clearAuthError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
