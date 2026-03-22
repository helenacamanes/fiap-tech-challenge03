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
import Transactions from "../screens/Transactions";
import Goals from "../screens/Goals";
import Profile from "../screens/Profile";


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
        initialRouteName={isFirstLaunch ? "Onboarding" : "Login"}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="AddGoal" component={Goals}
          options={{
            presentation: "transparentModal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}