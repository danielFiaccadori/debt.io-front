import react from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

const Button = ({ placeholder, onPress, ...rest }) => {

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{placeholder}</Text>
            </TouchableOpacity>
        </View>      
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginBottom: '%',
        marginTop: '10%',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#5a66d1',
        padding: 15,
        paddingHorizontal: 50,
        minWidth: '30%',
        marginHorizontal: 5,
        borderRadius: 50,
    },
    buttonText: {
        color: "white",
        fontSize: 15,
        fontFamily: 'Inter_700Bold',
    }
});

export default Button;