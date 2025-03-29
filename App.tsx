import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import ListView from './src/pages/ListView';
import { fetchCategories } from './src/core/api';

const App = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#f52516" />;
  }

  return (
    <View>
      <ListView data={categories} />
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    </View>
  );
};

export default App;
