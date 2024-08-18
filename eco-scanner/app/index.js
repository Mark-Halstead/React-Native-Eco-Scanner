import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E8F5E9', // Set the background color of the header
            borderBottomWidth: 0, // Remove the bottom border
            elevation: 0, // Remove shadow on Android
          },
          headerTintColor: '#388E3C', // Set the color of the back button
          headerTitle: '', // Remove the title from the header
          headerShadowVisible: false, // Remove the shadow on iOS
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
