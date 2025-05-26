import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const categories = [
  'ALIMENTACAO', 'TRANSPORTE', 'EDUCACAO', 'SAUDE', 'LAZER',
  'MORADIA', 'SERVICOS', 'VESTUARIO', 'TECNOLOGIA', 'VIAGEM',
  'INVESTIMENTOS', 'IMPOSTOS', 'OUTROS',
];

export const CategoryDropdown = ({ selectedCategory, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => onSelect(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione uma categoria" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '87%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 8,
    marginLeft: 8,
    color: '#666',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 0.25,
    borderColor: '#d1d3e0',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
