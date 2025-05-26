import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import SmallNoBgButton from './SmallNoBgButton';

const MainHeader = () => {

    const { userData, getLoggedUserData, isLoading } = useAuth();

    const onPress = () => {
        return (true)
    }

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

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        style={styles.profilePic}
                        source={
                            userData.fotoPerfilBase64
                                ? { uri: `data:image/jpeg;base64,${userData.fotoPerfilBase64}` }
                                : require('../assets/debt.io-logo.png')
                        }
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.greetingsSub}>Bem-vindo de volta</Text>
                        <Text style={styles.greetings}>{userData.nome}</Text>
                    </View>
                </View>

                {/* Ícone à direita */}
                <SmallNoBgButton icon="bell" onPress={onPress} />

            </View>
        </View>
    )
}

export default MainHeader;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 30,
        backgroundColor: '#183D3D'
    },
    greetingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
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