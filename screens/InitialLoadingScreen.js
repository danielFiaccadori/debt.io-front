import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InitialLoading = () => {
    return (
        <View style={styles.container}>
            <Text>Carregando...</Text>
        </View>
    );
};

export default InitialLoading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    }
});