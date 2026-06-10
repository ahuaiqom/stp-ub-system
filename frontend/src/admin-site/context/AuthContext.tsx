import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  apiLogin,
  apiLogout,
  apiRefresh,
  type AuthUser,
} from "../../services/auth.api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expDate: number;
  initializing: boolean;
}

interface AuthContextShape extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const KST = "kst_jatikerto";

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

const TOKEN_KEY = "stp_access_token";
const USER_KEY = "stp_user";
const EXP_KEY = "stp_exp";

const loadInitial = (): AuthState => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const exp = Number(localStorage.getItem(EXP_KEY) ?? 0);
    if (token && userStr) {
      return {
        token,
        user: JSON.parse(userStr) as AuthUser,
        expDate: exp,
        initializing: true,    // we still try a silent refresh below
      };
    }
  } catch {
    // ignore corrupt storage
  }
  return { token: null, user: null, expDate: 0, initializing: true };
};

const persist = (token: string, user: AuthUser, exp: number) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXP_KEY, String(exp));
};

const clearPersisted = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXP_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(loadInitial);
  const refreshTimerRef = useRef<number | null>(null);

  const scheduleRefresh = useCallback((exp: number) => {
    if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    if (!exp) return;
    const ms = exp * 1000 - Date.now() - 60_000; // refresh 60s before expiry
    if (ms <= 0) return;
    refreshTimerRef.current = window.setTimeout(() => {
      void refresh();
    }, ms);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const r = await apiRefresh();
      persist(r.accessToken, r.user, r.expDate);
      setState({
        token: r.accessToken,
        user: r.user,
        expDate: r.expDate,
        initializing: false,
      });
      scheduleRefresh(r.expDate);
    } catch {
      clearPersisted();
      setState({ token: null, user: null, expDate: 0, initializing: false });
    }
  }, [scheduleRefresh]);

  // On mount: try to refresh silently (uses HTTP-only cookie).
  useEffect(() => {
    void refresh();
    return () => {
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    };
  }, [refresh]);

  const login = useCallback(
    async (username: string, password: string) => {
      const r = await apiLogin(username, password);
      persist(r.accessToken, r.user, r.expDate);
      setState({
        token: r.accessToken,
        user: r.user,
        expDate: r.expDate,
        initializing: false,
      });
      scheduleRefresh(r.expDate);
    },
    [scheduleRefresh]
  );

  const logout = useCallback(async () => {
    const t = state.token;
    if (t) {
      try {
        await apiLogout(t);
      } catch {
        // server-side revoke best-effort
      }
    }
    clearPersisted();
    setState({ token: null, user: null, expDate: 0, initializing: false });
    if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
  }, [state.token]);

  const hasRole = useCallback(
    (role: string) => state.user?.roles?.[KST]?.includes(role) ?? false,
    [state.user]
  );

  const value = useMemo<AuthContextShape>(
    () => ({ ...state, login, logout, refresh, hasRole }),
    [state, login, logout, refresh, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextShape => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
