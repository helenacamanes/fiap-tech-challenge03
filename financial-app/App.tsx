import 'react-native-gesture-handler'; // Deve ser a primeira linha
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppRoutes } from './src/navigation';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AppRoutes />
    </>
  );
}