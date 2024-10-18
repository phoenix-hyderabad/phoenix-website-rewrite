import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

interface Access {
  allowed: string[];
  disallowed: string[];
}
interface AuthState {
  userId: string;
  email?: string;
  operations?: Access;
  exp: number;
}

interface AuthContextType {
  authState: AuthState | null;
  setAuthState: (accessToken?: string | null) => void;
  checkAccess: (requiredOperation: string) => boolean;
  refreshAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseJwt = (token: string) => {
  try {
    const decoded = jwtDecode<AuthState>(token);
    const curTime = Date.now() / 1000;
    return !decoded.exp || decoded.exp < curTime ? null : decoded; // check expiration
  } catch {
    console.error("Error decoding jwt");
    return null;
  }
};

function matchWildcard(resource: string, pattern: string): boolean {
  const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
  return regex.test(resource);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState | null>(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) return null;
    return parseJwt(accessToken);
  });

  const updateAuthState = useCallback(
    (accessToken?: string | null) => {
      if (!accessToken) {
        localStorage.removeItem("token");
        setAuthState(null);
      } else {
        localStorage.setItem("token", accessToken);
        setAuthState(parseJwt(accessToken));
      }
    },
    [setAuthState]
  );

  const refreshAuthState = useCallback(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) return null;
    setAuthState(parseJwt(accessToken));
  }, [setAuthState]);

  const checkAccess = useCallback(
    (requiredOperation: string) => {
      if (!authState || !authState.operations) return false;
      const access = authState.operations;
      if (access.disallowed.some((op) => matchWildcard(requiredOperation, op)))
        return false;
      if (
        access.allowed.includes("*") ||
        access.allowed.some((op) => matchWildcard(requiredOperation, op))
      )
        return true;
      return false;
    },
    [authState]
  );

  const value: AuthContextType = {
    authState,
    setAuthState: updateAuthState,
    checkAccess,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
