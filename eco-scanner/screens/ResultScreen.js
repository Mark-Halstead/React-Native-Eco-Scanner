import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { fetchProductInfo } from '../services/apiService';

export default function ResultScreen({ route }) {
  const { barcode } = route.params;
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductInfo(barcode)
      .then(data => {
        setProductInfo(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [barcode]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Product Name: {productInfo.product_name}</Text>
      <Text>Packaging: {productInfo.packaging}</Text>
      <Text>Eco Score: {productInfo.ecoscore_grade}</Text>
    </View>
  );
}
