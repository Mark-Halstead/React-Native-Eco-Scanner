import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function ResultScreen({ route }) {
  const { barcode } = route.params;
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        setProductData(response.data.product);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [barcode]);

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
      {/* Add more fields as needed */}
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
