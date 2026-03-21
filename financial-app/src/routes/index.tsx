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

// Stack que exibe o Onboarding e depois entrega o controle para AuthRoutes.
// O navigation.replace('Login') do seu Onboarding.tsx vai funcionar porque
// 'Login' está registrado aqui como a próxima tela.
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

  // false = sempre mostra onboarding (modo teste)
  // Quando quiser persistir, substitua por AsyncStorage (ver comentário abaixo)
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