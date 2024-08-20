import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, View, StatusBar } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    StatusBar.setHidden(true, 'slide'); // Hide the status bar without a timeout
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F5E9' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#E8F5E9' }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#E8F5E9',
                borderBottomWidth: 0,
                elevation: 0,
              },
              headerTintColor: '#388E3C',
              headerTitle: '',
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
}
