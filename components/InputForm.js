import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import MaskInput from 'react-native-mask-input';
import { Ionicons } from '@expo/vector-icons';

const LoginInputForm = ({
    label,
    value,
    onChangeText,
    style,
    keyboardType = 'default',
    mask,
    secureTextEntry,
    ...rest
}) => {
    const inputStyle = style === 'light' ? styles.lightInput : styles.darkInput;
    const [showPassword, setShowPassword] = useState(false);

    const toggleSecure = () => setShowPassword((prev) => !prev);

    const renderInput = () => {
        const isPassword = secureTextEntry === true;

        const inputProps = {
            style: [inputStyle, isPassword && styles.withIcon],
            value,
            keyboardType,
            onChangeText,
            secureTextEntry: isPassword && !showPassword,
            ...rest,
        };

        return (
            <View style={styles.inputWrapper}>
                {mask ? (
                    <MaskInput
                        {...inputProps}
                        mask={mask}
                    />
                ) : (
                    <TextInput
                        {...inputProps}
                    />
                )}
                {isPassword && (
                    <TouchableOpacity
                        onPress={toggleSecure}
                        style={styles.eyeButton}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <>
            <View style={styles.inputLabelContainer}>
                <Text style={styles.inputLabel}>{label}</Text>
            </View>
            {renderInput()}
        </>
    );
};

export default LoginInputForm;

const styles = StyleSheet.create({
    inputLabelContainer: {
        alignItems: 'flex-start',
        width: '75%',
        marginLeft: '5%',
    },
    inputLabel: {
        color: 'gray',
        marginBottom: 5,
        fontSize: 12.5,
        fontFamily: 'Inter_400Regular',
        textAlign: 'left',
    },
    inputWrapper: {
        position: 'relative',
        width: '80%',
        justifyContent: 'center',
    },
    withIcon: {
        paddingRight: 45, 
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 13,
        zIndex: 10,
    },
    darkInput: {
        backgroundColor: '#16171d',
        color: 'white',
        width: '100%',
        borderWidth: 0.25,
        borderColor: '#2d343f',
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 15,
        fontFamily: 'Inter_400Regular',
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    lightInput: {
        backgroundColor: '#ffffff',
        color: '#000',
        width: '100%',
        borderWidth: 0.25,
        borderColor: '#d1d3e0',
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 15,
        fontFamily: 'Inter_400Regular',
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
});