import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import JournalListScreen from '../screens/JournalListScreen';
import AddJournalScreen from '../screens/AddJournalScreen';
import EditJournalScreen from '../screens/EditJournalScreen';
import AudioToTextScreen from '../screens/AudioToTextScreen';
import EmotionTagScreen from '../screens/EmotionTagScreen';
import MoodPaletteScreen from '../screens/MoodPaletteScreen';
import StreakScreen from '../screens/StreakScreen';
import SearchEntriesScreen from '../screens/SearchEntriesScreen';
import theme from '../theme';

const { colors } = theme;

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    border: colors.borderSoft,
    text: colors.text,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.textOnPrimary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JournalList"
          component={JournalListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddJournal"
          component={AddJournalScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditJournal"
          component={EditJournalScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AudioToText"
          component={AudioToTextScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmotionTag"
          component={EmotionTagScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MoodPalette"
          component={MoodPaletteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Streak"
          component={StreakScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchEntries"
          component={SearchEntriesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
