import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { AuthRoutes } from "./AuthRoutes";
import { AppRoutes } from "./AppRoutes";
import { useAuth } from "../contexts/AuthContext";

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}

export function AppRoutesContainer() {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A1128",
    alignItems: "center",
    justifyContent: "center",
  },
});
