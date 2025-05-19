import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const MainHeader = () => {

    const { userData, getLoggedUserData, isLoading } = useAuth();

    useEffect(() => {
        if (!userData) {
        getLoggedUserData();
        }
    }, [userData]);

    if (isLoading) {
        return <Text>Carregando dados...</Text>;
    }

    if (!userData) {
        return <Text> parece que não há usuários aqui...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.greetingsContainer}>
                <Image
                    style={styles.profilePic}
                    source={require('../assets/debt.io-logo.png')}
                />
                <View style={{left: 10, top: 6}}>
                    <Text style={styles.greetingsSub}>Bem-vindo de volta</Text>
                    <Text style={styles.greetings}>{userData.nome}</Text>
                </View>
            </View>
        </View>
    )
}

export default MainHeader;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#183D3D'
    },
    greetingsContainer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    greetings: {
        color: 'white',
        fontSize: 23,
        fontFamily: 'Inter_400Regular',
    },
    profilePic: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 50,
        margin: 0
    },
    greetingsSub: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    }
});