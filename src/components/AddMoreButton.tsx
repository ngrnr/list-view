import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AddMoreButtonProps {
  onPress: () => void;
}

const AddMoreButton: React.FC<AddMoreButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      <Text style={styles.text}>Add More Data</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#87CEFA',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddMoreButton;
