import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const InitialLoading = () => {
    return (
        <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <Text>Carregando...</Text>
                </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default InitialLoading;

const styles = StyleSheet.create({
    container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
    gradient: {
		flex: 1,
	},
});