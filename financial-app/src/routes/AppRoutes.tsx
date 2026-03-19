import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../@types/navigation";

import { Home } from "../screens/Home";
import AddTransaction from "../screens/AddTransaction";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0A1128" },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddTransaction" component={AddTransaction} />
    </Stack.Navigator>
  );
}
