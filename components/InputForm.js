import { React, useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import MaskInput from 'react-native-mask-input';

const LoginInputForm = ({ label, value, onChangeText, style, keyboardType='default', mask, ...rest }) => {
    const inputStyle = style === 'light' ? styles.lightInput : styles.darkInput;

    return (
        <>
            <View style={styles.inputLabelContainer}>
                <Text style={styles.inputLabel}>{label}</Text>
            </View>
			{ mask ? (
				<MaskInput
					style={inputStyle}
					value={value}
					onChangeText={(masked) => onChangeText(masked)}
					keyboardType={keyboardType}
					mask={mask}
					{...rest}
				/>
			) : (
				<TextInput
					style={inputStyle}
					value={value}
					keyboardType={keyboardType}
					onChangeText={onChangeText}
					{...rest}
				/>
			)}
        </>
    );
}

export default LoginInputForm;

const styles = StyleSheet.create({
    inputLabelContainer: {
		alignItems: 'flex-start',
		width: '75%',
		marginLeft: '5%'
	},
	inputLabel: {
		color: 'gray',
		marginBottom: 5,
		fontSize: 12.5,
		fontFamily: 'Inter_400Regular',
		textAlign: 'left'
	},
	darkInput: {
		backgroundColor: '#16171d',
		color: 'white',
		width: '75%',
		borderWidth: 0.25,
		borderColor: '#2d343f',
		height: 50,
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 15,
		fontFamily: 'Inter_400Regular',
		marginBottom: 10,
		elevation: 2, // Android
        shadowColor: '#000', // iOS
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
	},
    lightInput: {
        backgroundColor: '#ffffff',
        color: '#000',
		width: '90%',
        minWidth: '90%',
		borderWidth: 0.25,
        borderColor: '#d1d3e0',
		height: 50,
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 15,
		fontFamily: 'Inter_400Regular',
		marginBottom: 10,
		elevation: 2, // Android
        shadowColor: '#000', // iOS
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    }
})