import { useEffect, useState } from "react";
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useAuth } from "../contexts/AuthContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Dimensions } from "react-native";
import LoginInputForm from "./InputForm";
import { Masks } from "react-native-mask-input";
import { Ionicons } from "@expo/vector-icons";
import LoginAnimation from './LoginAnimation';
import LargeButton from './LargeButton';
import { parseISO, compareDesc } from 'date-fns';

function formatCurrencyShort(value) {
  const number = typeof value === 'number' && !isNaN(value) ? value : 0;

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
  const { token, userBalance, userDebts } = useAuth();

  if (!token) return (
    <Text>Ops</Text>
  );

  const total = typeof userBalance === 'number' ? userBalance : 0;
  const spent = typeof userDebts === 'number' ? userDebts : 0;
  const remaining = total - spent;
  const fill = total === 0 ? 0 : (remaining / total) * 100;

  return (
    <View style={styles.balanceContainer}>
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
            <Text style={styles.value}>
              {Number.isFinite(remaining) ? remaining.toFixed(2) : 'R$ 0,00'}
            </Text>
            <Text style={styles.label}>SEUS GASTOS</Text>
          </>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export const AllDebts = () => {
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
    <View style={styles.allDebtsContainer}>
      <Text style={styles.lastDebtsHeader}>Suas contas</Text>
      <FlatList
        data={lastThreeDebts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 12 }}>Parece que você ainda não possui contas!</Text>
            <Text style={{ color: 'white', fontFamily: 'Inter_400Regular', fontSize: 10 }}>Você pode adicionar uma nova em "Nova Conta"</Text>
          </View>
        }
      />
    </View>
  );

}

export const LastDebts = () => {
  const { getUserDebtList, userDebtList } = useAuth();

  useEffect(() => {
    if (!userDebtList) {
      getUserDebtList();
    }
  }, [userDebtList]);

  const lastThreeDebts = Array.isArray(userDebtList)
    ? [...userDebtList]
      .sort((a, b) =>
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
      )
      .slice(0, 3)
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
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 12 }}>
              Parece que você ainda não possui contas!
            </Text>
            <Text style={{ color: 'white', fontFamily: 'Inter_400Regular', fontSize: 10 }}>
              Você pode adicionar uma nova em "Nova Conta"
            </Text>
          </View>
        }
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
        style="dark"
        mask={Masks.BRL_CURRENCY}
      />
      <LargeButton placeholder={"Posso gastar?"}></LargeButton>
    </View>
  );
}

export const BalanceCard = () => {
  const { token, getUserBalance, userBalance = 0, getUserDebts, userDebts = 0 } = useAuth();

  useEffect(() => {
    if (token) {
      getUserBalance();
      getUserDebts();
    }
  }, [token]);

  if (!token) return (
    <Text>Ops</Text>
  );

  const totalBalance = userBalance - userDebts;

  return (
    <View style={styles.container}>
      <Text style={styles.totalLabel}>Você pode gastar até</Text>
      <Text style={styles.totalBalance}>{formatCurrencyShort(totalBalance)}</Text>

      <View style={styles.cardsContainer}>
        <View style={[styles.card, { backgroundColor: '#304FFE' }]}>
          <Ionicons name="arrow-down-circle" size={20} color="white" style={styles.icon} />
          <Text style={styles.cardTitle}>Entradas</Text>
          <Text style={styles.cardValue}>{formatCurrencyShort(userBalance)}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#D32F2F' }]}>
          <Ionicons name="arrow-up-circle" size={20} color="white" style={styles.icon} />
          <Text style={styles.cardTitle}>Saídas</Text>
          <Text style={styles.cardValue}>{formatCurrencyShort(userDebts)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.1)',
    paddingVertical: 20,
    backgroundColor: 'rgba(24, 61, 61, 0.1)',
    borderTopLeftRadius: 20,
    borderRadius: 5,
    borderTopRightRadius: 20,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter_400Regular',
    marginBottom: 5,
  },

  totalBalance: {
    fontSize: 40,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 20,
  },

  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    height: 100,
    width: '100%',
  },

  card: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },

  cardValue: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginTop: 2,
  },

  icon: {
    marginBottom: 5,
  },
  containerMiddle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.1)',
    paddingVertical: 50,
    borderRadius: 5,
    backgroundColor: 'rgba(24, 61, 61, 0.1)',
    marginVertical: 10,
    marginBottom: 120
  },
  allDebtsContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.1)',
    paddingVertical: 20,
    marginBottom: 150,
    backgroundColor: 'rgba(24, 61, 61, 0.1)',
    borderRadius: 5,
  },
  lastDebtsContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.1)',
    paddingVertical: 20,
    backgroundColor: 'rgba(24, 61, 61, 0.1)',
    borderRadius: 5,
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
    backgroundColor: 'rgba(22, 73, 73, 0.1)',
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
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 0.75,
    borderColor: 'rgba(32, 83, 83, 0.1)',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 61, 61, 0.1)',
    paddingTop: 30,
    marginVertical: 10,
  },
  balanceSubMargin: {
    fontSize: 12,
    marginBottom: 35,
    color: 'white',
    fontFamily: 'Inter_400Regular',
  },
});
