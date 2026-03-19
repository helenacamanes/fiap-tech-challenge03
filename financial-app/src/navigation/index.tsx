import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';

import { RootStackParamList } from '../@types/navigation';
import { darkTheme as COLORS } from '../theme';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const hasLaunched = await AsyncStorage.getItem('@lighthouse:alreadyLaunched');
        
        if (hasLaunched === null) {
          // Primeira vez abrindo o app
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        setIsFirstLaunch(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkFirstLaunch();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isFirstLaunch ? "Onboarding" : "Login"}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background }
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}