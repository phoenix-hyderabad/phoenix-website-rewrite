import { createContext, useState, useContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  userId: string;
  email?: string;
  protectedRoutes?: string[];
}

interface AuthContextType {
  authState: AuthState | null;
  setAuthState: (accessToken?: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseJwt = (token: string) => {
  try {
    const decoded = jwtDecode<AuthState>(token);
    return decoded;
  } catch {
    console.error("Error decoding jwt");
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState | null>(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) return null;
    return parseJwt(accessToken);
  });

  const updateAuthState = (accessToken?: string | null) => {
    if (!accessToken) {
      localStorage.removeItem("token");
      setAuthState(null);
    } else {
      localStorage.setItem("token", accessToken);
      setAuthState(parseJwt(accessToken));
    }
  };

  const value: AuthContextType = {
    authState,
    setAuthState: updateAuthState,
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
