import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const paymentMethods = [
  { key: 'CARTAO_CREDITO', label: 'Crédito', icon: <FontAwesome5 name="credit-card" size={18} color="#fff" /> },
  { key: 'CARTAO_DEBITO', label: 'Débito', icon: <FontAwesome5 name="money-check-alt" size={18} color="#fff" /> },
  { key: 'BOLETO', label: 'Boleto', icon: <MaterialCommunityIcons name="barcode" size={18} color="#fff" /> },
  { key: 'PIX', label: 'Pix', icon: <MaterialCommunityIcons name="qrcode" size={18} color="#fff" /> },
  { key: 'DINHEIRO', label: 'Dinheiro', icon: <Feather name="dollar-sign" size={18} color="#fff" /> },
];

export const PaymentMethodSelector = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Forma de Pagamento</Text>
      <View style={styles.optionsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.key}
            style={[
              styles.option,
              selected === method.key && styles.optionSelected,
            ]}
            onPress={() => onSelect(method.key)}
          >
            {method.icon}
            <Text style={styles.optionText}>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    marginLeft: 18,
    color: '#666',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    borderRadius: 15,
    padding: 10,
    margin: 5,
  },
  optionSelected: {
    backgroundColor: '#999',
  },
  optionText: {
    marginLeft: 8,
    color: 'white',
    fontFamily: 'Inter_400Regular',
  },
});
