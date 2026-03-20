// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { RootStackParamList } from "../@types/navigation";

// //import OnboardingScreen from "../screens/OnboardingScreen";
// import Login from "../screens/Login";
// import Register from "../screens/Register";
// //import HomeScreen from "../screens/HomeScreen";
// import AddTransaction from "../screens/AddTransaction";
// import ForgotPassword from "../screens/ForgotPassword";

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Onboarding"
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         {/*<Stack.Screen name="Onboarding" component={Onboarding} />*/}
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Register" component={Register} />
//         <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
//         {/*<Stack.Screen name="Home" component={Home} />*/}
//         <Stack.Screen name="AddTransaction" component={AddTransaction} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
