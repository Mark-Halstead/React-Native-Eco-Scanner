import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const getEcoScoreFeedback = (ecoScore) => {
    switch (ecoScore) {
      case 'A':
      case 'B':
        return 'This product has a good eco-score, indicating a lower environmental impact.';
      case 'C':
        return 'This product has a moderate eco-score. Consider if there are better options available.';
      case 'D':
      case 'E':
        return 'This product has a bad eco-score, indicating a higher environmental impact. Consider choosing a more environmentally friendly option.';
      default:
        return 'Eco-score not available.';
    }
  };

  const evaluatePackaging = (packaging) => {
    if (!packaging) return 'Packaging information not available.';

    const lowerCasePackaging = packaging.toLowerCase();

    if (lowerCasePackaging.includes('paper') || lowerCasePackaging.includes('glass') || lowerCasePackaging.includes('metal') || lowerCasePackaging.includes('aluminum')) {
      return 'This product uses environmentally friendly materials.';
    } else if (lowerCasePackaging.includes('pet') || lowerCasePackaging.includes('hdpe')) {
      return 'This product uses recyclable plastic.';
    } else if (lowerCasePackaging.includes('pvc') || lowerCasePackaging.includes('non-recyclable')) {
      return 'This product uses non-recyclable materials.';
    } else {
      return 'Packaging material is mixed or not clearly defined.';
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <View style={styles.infoBlock}>
          <Text style={styles.text}>Eco-Score: {productData.ecoscore_grade.toUpperCase()}</Text>
          <Text style={styles.infoText}>
            The Eco-Score is a label that provides information on the environmental impact of a product. 
            It takes into account factors such as greenhouse gas emissions, biodiversity impact, 
            water consumption, and pollution. Grades range from 'A' (low impact) to 'E' (high impact).
          </Text>
          <Text style={styles.feedbackText}>{getEcoScoreFeedback(productData.ecoscore_grade.toUpperCase())}</Text>
        </View>
      )}
      {productData.packaging && (
        <View style={styles.infoBlock}>
          <Text style={styles.text}>Packaging: {productData.packaging}</Text>
          <Text style={styles.infoText}>{evaluatePackaging(productData.packaging)}</Text>
        </View>
      )}
      {productData.carbon_footprint_value && (
        <View style={styles.infoBlock}>
          <Text style={styles.text}>Carbon Footprint: {productData.carbon_footprint_value} {productData.carbon_footprint_unit}</Text>
          <Text style={styles.infoText}>
            The carbon footprint represents the total greenhouse gas emissions caused directly or indirectly by the product. 
            A lower carbon footprint indicates a lower environmental impact.
          </Text>
        </View>
      )}

      <Button title="View History" onPress={() => navigation.navigate('History')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  infoBlock: {
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: 'gray',
  },
  feedbackText: {
    fontSize: 16,
    color: '#0000ff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
