import { useEffect, useState } from "react";
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useAuth } from "../contexts/AuthContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Dimensions } from "react-native";
import LoginInputForm from "./InputForm";
import { Masks } from "react-native-mask-input";

function formatCurrencyShort(value) {
  const number = typeof value === 'bigint' ? Number(value) : value;

  if (number >= 1_000_000) {
    return `R$ ${(number / 1_000_000).toFixed(1)}M`;
  } else if (number >= 1_000) {
    return `R$ ${(number / 1_000).toFixed(1)}k`;
  } else {
    return `R$ ${number.toFixed(2)}`;
  }
}

const chartConfig = {
  backgroundGradientFrom: 'rgb(158, 175, 136)',
  backgroundGradientTo: 'rgb(158, 175, 136)',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

export const BalanceProgressCircle = () => {
  const { userBalance = 0, userDebts = 0 } = useAuth();

  const total = userBalance;
  const spent = userDebts;
  const remaining = total - spent;
  const fill = total === 0 ? 0 : (remaining / total) * 100;

  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceSubMargin}>Relação desse mês</Text>
      <AnimatedCircularProgress
        size={Dimensions.get('window').width - 120}
        width={30}
        fill={fill}
        tintColor="#24ff4b"
        backgroundColor="#26422b"
        arcSweepAngle={240}
        rotation={240}
        lineCap='round'
      >
        {(fill) => (
          <>
            <Text style={styles.value}>{remaining.toFixed(2)}</Text>
            <Text style={styles.label}>DISPONÍVEL</Text>
          </>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export const LastDebts = () => {
  const { getUserDebtList, userDebtList } = useAuth();

  useEffect(() => {
    if (!userDebtList) {
      getUserDebtList();
    }
  }, [userDebtList]);

  const lastThreeDebts = Array.isArray(userDebtList)
    ? userDebtList.reverse()
    : [];

  const renderItem = ({ item }) => (
    <View style={styles.debtItem}>
      <Text style={styles.name}>{item.nomeCompra}</Text>
      <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
      <Text style={styles.data}>Vencimento: {item.dataVencimento}</Text>
      <Text style={styles.categoria}>Categoria: {item.categoria}</Text>
    </View>
  );

  return (
    <View style={styles.lastDebtsContainer}>
      <Text style={styles.lastDebtsHeader}>Atividade</Text>
      <FlatList
        data={lastThreeDebts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export const CanWasteCard = () => {
  const [value, setValue] = useState('');

  return (
    <View style={styles.containerMiddle}>
      <LoginInputForm
        label="Valor"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style="light"
        mask={Masks.BRL_CURRENCY}
      />
    </View>
  );
}

export const BalanceCard = () => {
  const { getUserBalance, userBalance, getUserDebts, userDebts } = useAuth();

  useEffect(() => {
    getUserBalance();
    getUserDebts();
  }, []);

  function total() {
    return userBalance - userDebts;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.balanceSub}>Você pode gastar até</Text>
      <Text style={styles.balanceText}>
        {userBalance != null
          ? formatCurrencyShort(total())
          : 'Calculando...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.73)',
    paddingVertical: 20,
    backgroundColor: 'rgba(24, 61, 61, 0.5)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginVertical: 10,
  },
  containerMiddle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.73)',
    paddingVertical: 30,
    backgroundColor: 'rgba(24, 61, 61, 0.5)',
    marginVertical: 10,
  },
  lastDebtsContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.73)',
    paddingVertical: 20,
    backgroundColor: 'rgba(24, 61, 61, 0.5)',
    borderRadius: 20,
    marginVertical: 10,
    height: 420,
  },
  lastDebtsHeader: {
    fontSize: 17.5,
    color: 'white',
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 40,
    color: 'white',
    fontFamily: 'Inter_700Bold',
  },
  balanceSub: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Inter_400Regular',
  },

  // Items list styles
  debtItem: {
    width: '100%',
    backgroundColor: 'rgba(22, 73, 73, 0.38)',
    padding: 15,
    borderRadius: 3,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#5C8374',
  },
  name: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  valor: {
    fontSize: 15,
    color: '#D2DE32',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  data: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  categoria: {
    fontSize: 12,
    color: '#A9BDBD',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  //Circular progress
  value: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  label: {
    fontSize: 12,
    color: '#B2B2B2',
    fontFamily: 'Inter_400Regular',
  },
  balanceContainer: {
    padding: 30,
    justifyContent: 'center',
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.73)',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 61, 61, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 10,
  },
  balanceSubMargin: {
    fontSize: 12,
    marginBottom: 35,
    color: 'white',
    fontFamily: 'Inter_400Regular',
  },
});
