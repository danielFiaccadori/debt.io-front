import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { BarChart } from "react-native-chart-kit";

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

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


export const BalanceCard = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.balanceSub}>Você pode gastar até</Text>
            <Text style={styles.balanceText}>$55,7k</Text>
            <BarChart
                data={data}
                width={310}
                height={110}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
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
        borderRadius: 20,
        marginVertical: 10
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
    }
})