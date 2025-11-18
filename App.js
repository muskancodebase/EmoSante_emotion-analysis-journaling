import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { JournalProvider } from './context/JournalContext';
import { FeedbackProvider } from './context/FeedbackContext';

export default function App() {
  return (
    <FeedbackProvider>
      <JournalProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </JournalProvider>
    </FeedbackProvider>
  );
}
