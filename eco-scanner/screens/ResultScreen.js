import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ResultScreen({ route, navigation }) {
  const { barcode } = route.params || {}; // Safely extract barcode
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!barcode) {
      console.error('No barcode provided');
      navigation.goBack();
      return;
    }

    const fetchProductData = async () => {
      try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        setProductData(response.data.product);
        await saveToHistory(response.data.product); // Save product data to history
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [barcode]);

  const saveToHistory = async (product) => {
    try {
      const history = await AsyncStorage.getItem('scanHistory');
      const historyArray = history ? JSON.parse(history) : [];
      historyArray.push(product);
      await AsyncStorage.setItem('scanHistory', JSON.stringify(historyArray));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!productData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productData.product_name}</Text>
      <Text style={styles.text}>Brand: {productData.brands}</Text>
      <Text style={styles.text}>Category: {productData.categories}</Text>
      <Text style={styles.text}>Nutritional Information: {productData.nutriments.energy_value} {productData.nutriments.energy_unit}</Text>
      <Button title="View History" onPress={() => navigation.navigate('History')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
