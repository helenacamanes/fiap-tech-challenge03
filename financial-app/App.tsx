import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import  AppRoutes  from './src/navigation/index'

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AppRoutes />
    </>
  );
}