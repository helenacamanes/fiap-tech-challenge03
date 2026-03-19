import "react-native-gesture-handler";
import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import { AppRoutesContainer } from "./src/routes";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutesContainer />
    </AuthProvider>
  );
}
