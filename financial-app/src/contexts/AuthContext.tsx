import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "firebase/auth";
import { observeAuthState } from "../services/authService";

interface AuthContextData {
  user: User | null;
  initializing: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  initializing: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: !!user,
    }),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
