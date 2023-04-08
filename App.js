import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AudioList from './app/screens/AudioList';
import AudioProvider from './app/context/AudioProvider';
import AppNavigator from './app/navigation/AppNavigator';



// const MyTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: color.APP_BG,
//   },
// };


export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer >
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>

    
  );
}