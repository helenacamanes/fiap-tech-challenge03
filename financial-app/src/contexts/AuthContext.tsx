import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "firebase/auth";
import { observeAuthState } from "../services/authService";
import { Text, View } from "react-native";

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
    let unsubscribe: undefined | (() => void);

    try {
      console.log("AuthProvider: subscribing to auth state");

      unsubscribe = observeAuthState((firebaseUser) => {
        console.log(
          "AuthProvider: auth state changed",
          firebaseUser?.email ?? "no user",
        );
        setUser(firebaseUser);
        setInitializing(false);
      });
    } catch (error) {
      console.error("AuthProvider: failed to observe auth state", error);
      setInitializing(false);
    }

    const timeout = setTimeout(() => {
      console.warn("AuthProvider: auth init timeout");
      setInitializing(false);
    }, 4000);

    return () => {
      clearTimeout(timeout);
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: !!user,
    }),
    [user, initializing],
  );

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A1128",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Loading auth...</Text>
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
