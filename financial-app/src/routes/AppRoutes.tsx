import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "../@types/navigation";
import { MainTabs } from "./MainTabs";
import AddTransaction from "../screens/AddTransaction";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0A1128" },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AddTransaction" component={AddTransaction} />
    </Stack.Navigator>
  );
}
