import "react-native-gesture-handler";
import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import { TransactionProvider } from "./src/contexts/TransactionContext";
import { AppRoutesContainer } from "./src/routes";
import { GoalsProvider } from "./src/contexts/GoalsContext";

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <GoalsProvider>
          <AppRoutesContainer />
        </GoalsProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}