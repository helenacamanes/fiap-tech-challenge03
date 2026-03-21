import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList } from "../@types/navigation";

import Onboarding from "../screens/Onboarding";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import AddTransaction from "../screens/AddTransaction";
import ForgotPassword from "../screens/ForgotPassword";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        await AsyncStorage.removeItem("@lighthouse:alreadyLaunched");

        const hasLaunched = await AsyncStorage.getItem("@lighthouse:alreadyLaunched");
        
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        setIsFirstLaunch(false);
      }
    }

    checkFirstLaunch();
  }, []);

  // Enquanto o AsyncStorage é lido, exibimos um carregamento
  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0A1128" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // Define a rota inicial baseada na persistência de dados
        initialRouteName={isFirstLaunch ? "Onboarding" : "Login"}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right", // Transição fluida para o onboarding
        }}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}