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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.product_name}</Text>
      <Text style={styles.text}>Brand: {item.brands}</Text>
      <Text style={styles.text}>Category: {item.categories}</Text>
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
  noHistoryText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});
