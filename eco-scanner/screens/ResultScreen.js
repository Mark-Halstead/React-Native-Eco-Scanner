import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';

export default function ResultScreen({ route, navigation }) {
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

      {/* Nutritional Breakdown */}
      <Text style={styles.sectionTitle}>Nutritional Information:</Text>
      <Text style={styles.text}>Calories: {productData.nutriments.energy_value} {productData.nutriments.energy_unit}</Text>
      <Text style={styles.text}>Fat: {productData.nutriments.fat_value} {productData.nutriments.fat_unit}</Text>
      <Text style={styles.text}>Saturated Fat: {productData.nutriments['saturated-fat_value']} {productData.nutriments.fat_unit}</Text>
      <Text style={styles.text}>Sugars: {productData.nutriments.sugars_value} {productData.nutriments.sugars_unit}</Text>
      <Text style={styles.text}>Proteins: {productData.nutriments.proteins_value} {productData.nutriments.proteins_unit}</Text>
      {/* Add more nutrients as needed */}

      {/* Environmental Impact */}
      <Text style={styles.sectionTitle}>Environmental Impact:</Text>
      {productData.ecoscore_grade && (
        <Text style={styles.text}>Eco-Score: {productData.ecoscore_grade.toUpperCase()}</Text>
      )}
      {productData.packaging && (
        <Text style={styles.text}>Packaging: {productData.packaging}</Text>
      )}
      {productData.carbon_footprint_value && (
        <Text style={styles.text}>Carbon Footprint: {productData.carbon_footprint_value} {productData.carbon_footprint_unit}</Text>
      )}

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
