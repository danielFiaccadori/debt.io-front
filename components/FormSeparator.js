import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

const FormSeparator = ({ text }) => {
    return (
        <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>login</Text>
            <View style={styles.line} />
        </View>
    )
}

export default FormSeparator;

const styles = StyleSheet.create({
    line: {
		flex: 1,
		height: 1,
		backgroundColor: '#2d343f'
	},
	separatorText: {
		marginHorizontal: 10,
		color: '#aaa',
		fontSize: 12,
		fontFamily: 'Inter_400Regular',
		textTransform: 'uppercase'
	},
    separatorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '75%',
		alignSelf: 'center'
	}
})