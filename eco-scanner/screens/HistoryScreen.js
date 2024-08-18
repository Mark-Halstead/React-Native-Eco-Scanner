import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('scanHistory');
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          const filteredHistory = parsedHistory.filter(item => item && item.product_name); // Filter out invalid entries
          setHistory(filteredHistory);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.product_name}</Text>
      <Text style={styles.text}>Brand: {item.brands}</Text>
      <Text style={styles.text}>Category: {item.categories}</Text>

      {/* Environmental Impact */}
      {item.ecoscore_grade && (
        <View style={styles.infoBlock}>
          <Text style={styles.text}>Eco-Score: {item.ecoscore_grade.toUpperCase()}</Text>
          <Text style={styles.infoText}>{getEcoScoreFeedback(item.ecoscore_grade.toUpperCase())}</Text>
        </View>
      )}
      {item.packaging && (
        <View style={styles.infoBlock}>
          <Text style={styles.text}>Packaging: {item.packaging}</Text>
          <Text style={styles.infoText}>{evaluatePackaging(item.packaging)}</Text>
        </View>
      )}
      {item.carbon_footprint_value && (
        <View style={styles.infoBlock}>
          <Text style={styles.text}>Carbon Footprint: {item.carbon_footprint_value} {item.carbon_footprint_unit}</Text>
          <Text style={styles.infoText}>The carbon footprint represents the total greenhouse gas emissions caused directly or indirectly by the product. A lower carbon footprint indicates a lower environmental impact.</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noHistoryText}>No scan history available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginTop: 4,
  },
  infoBlock: {
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: 'gray',
  },
  noHistoryText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});
