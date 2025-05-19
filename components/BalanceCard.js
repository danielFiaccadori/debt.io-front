import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";

const BalanceCard = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.balanceSub}>Você pode gastar até</Text>
            <Text style={styles.balanceText}>$55,7k</Text>
        </View>
    );
}

export default BalanceCard;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'rgba(12, 12, 12, 0.5)',
        borderRadius: 30,
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