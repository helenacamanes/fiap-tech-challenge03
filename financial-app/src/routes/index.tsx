import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthRoutes } from "./AuthRoutes";
import { AppRoutes } from "./AppRoutes";
import { useAuth } from "../contexts/AuthContext";
import Onboarding from "../screens/Onboarding";

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A1128",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={AuthRoutes} />
    </Stack.Navigator>
  );
}

export function AppRoutesContainer() {
  const { initializing, isAuthenticated } = useAuth();

  const [onboardingDone] = useState(false);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppRoutes />
      ) : onboardingDone ? (
        <AuthRoutes />
      ) : (
        <OnboardingStack />
      )}
    </NavigationContainer>
  );
}