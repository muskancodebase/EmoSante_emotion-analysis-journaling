import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { JournalProvider } from './context/JournalContext';

export default function App() {
  return (
    <JournalProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </JournalProvider>
  );
}
