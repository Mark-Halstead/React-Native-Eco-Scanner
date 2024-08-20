import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EcoScanner</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.buttonText}>Go to Scan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>View Scan History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Light green background for a fresh feel
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32, // Larger font size for a bold statement
    fontWeight: 'bold',
    color: '#388E3C', // Deep green color to match the eco-friendly theme
    marginBottom: 40, // Space below the title
  },
  button: {
    backgroundColor: '#4CAF50', // Green color for buttons to keep the theme consistent
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Rounded corners for a modern look
    marginBottom: 20, // Space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Add some depth with shadow
  },
  buttonText: {
    color: '#FFFFFF', // White text to contrast with the green buttons
    fontSize: 18,
    fontWeight: '600',
  },
});
