import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GoTopButtonProps {
  onPress: () => void;
}

const GoTopButton: React.FC<GoTopButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Go Top</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f52516',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GoTopButton;
