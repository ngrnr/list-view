import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AddMoreButton, CustomModal, GoTopButton, LoadingOverlay } from '../components';
import { fetchJokes } from '../core/api';

const ListView: React.FC<{ data: string[] }> = ({ data }) => {
  const [list, setList] = useState(data);
  const [childData, setChildData] = useState<{ [key: string]: string[] }>({});
  const [loadCount, setLoadCount] = useState<{ [key: string]: number }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJoke, setSelectedJoke] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setList(data);
    const initialLoadCount = data.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as { [key: string]: number });

    setLoadCount(initialLoadCount);
  }, [data]);

  const resetList = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      const shuffledData = [...list].sort(() => Math.random() - 0.5);
      setList(shuffledData);
      setChildData({});
      setExpandedCategories({});
      setIsRefreshing(false);
    }, 1000);
  };

  const moveToTop = (index: number) => {
    const updatedList = [...list];
    const [selected] = updatedList.splice(index, 1);
    updatedList.unshift(selected);
    setList(updatedList);
  };

  const addMoreJokes = async (category: string) => {
    const newJokes = await fetchJokes(category);
    setChildData((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), ...newJokes],
    }));

    setLoadCount((prev) => ({
      ...prev,
      [category]: (prev[category] || 0) + 1,
    }));
  };

  const toggleExpand = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <View>
      <LoadingOverlay visible={isRefreshing} />

      <View style={styles.header}>
        <Text style={styles.headerText}>My List View</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => resetList()}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TouchableOpacity style={styles.headerRow} onPress={() => toggleExpand(item)}>
              <Text style={styles.number}>{index + 1}</Text>
              <Text style={styles.category}>{item}</Text>
              <View style={styles.actions}>
                {index === 0 ? (
                  <View style={styles.topLabel}>
                    <Text style={styles.topLabelText}>Top</Text>
                  </View>
                ) : (
                  <GoTopButton onPress={() => moveToTop(index)} />
                )}
                <TouchableOpacity onPress={() => toggleExpand(item)} style={styles.arrowButton}>
                  <Text style={styles.arrowText}>{expandedCategories[item] ? '▲' : '▼'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {expandedCategories[item] && (
              <>
                <FlatList
                  data={childData[item] || []}
                  keyExtractor={(joke, idx) => idx.toString()}
                  renderItem={({ item: joke }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedJoke(joke);
                        setModalVisible(true);
                      }}
                    >
                      <Text style={styles.joke}>{joke}</Text>
                    </TouchableOpacity>
                  )}
                />
                {loadCount[item] < 2 && <AddMoreButton onPress={() => addMoreJokes(item)} />}
              </>
            )}
          </View>
        )}
      />
      <CustomModal visible={modalVisible} text={selectedJoke} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: 'gold',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  number: {
    fontWeight: 'bold',
  },
  category: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  joke: {
    fontSize: 14,
    color: '#555',
    marginVertical: 3,
  },
  topLabel: {
    backgroundColor: '#87CEFA',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  topLabelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    marginLeft: 10,
  },
  arrowText: {
    fontSize: 20,
  },
});

export default ListView;
